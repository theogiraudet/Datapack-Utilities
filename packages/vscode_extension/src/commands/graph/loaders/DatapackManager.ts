import * as fs from "fs";
import path = require("path");
import * as vscode from "vscode";
import { ArtifactLoader } from "../interfaces/ArtifactLoader";
import { Datapack, Graph, GraphType, MinecraftArtifact, Namespace, NamespaceId, UnloadedNamespace } from "../models/models";
import { GraphRenderer } from "../interfaces/GraphRenderer";

export class DatapackManager {

    private readonly artifactLoaders: ArtifactLoader[] = [];

    private readonly datapacks: Datapack[] = [];

    private readonly allNamespaces: string[] = [];

    private graph: Graph.ArtifactGraph | undefined = undefined;

    private isDirty: boolean = true;

    constructor(loaders: ArtifactLoader[]) {
        this.artifactLoaders.push(...loaders);
    }

    getGraph(): Graph.ArtifactGraph {

        if(this.isDirty && !this.graph) {
            const resolvedNodes: Map<string, Graph.ResolvedArtifactNode> = new Map();
            const unresolvedNodes: Graph.UnresolvedArtifactNode[] = [];
            const edges: Graph.ArtifactEdge[] = [];

            const artifacts: MinecraftArtifact[] = [];

            // Create resolved nodes
            for(const datapack of this.datapacks) {
                for(const namespace of datapack.namespaces) {
                    if(namespace.loaded) {
                        namespace.artifacts.forEach(artifact => { 
                            const {name, qualifiedName, path, type} = artifact;
                            artifacts.push(artifact);
                            resolvedNodes.set(qualifiedName, { type, name, path, qualifiedName, exist: true }); 
                        });
                    }
                }
            }

            for(const artifact of artifacts) {
                for(const call of artifact.calls) {
                    let node : Graph.ArtifactNode | undefined = resolvedNodes.get(call);
                    // Create unresolved nodes
                    if(!node) {
                        const undefinedNode: Graph.UnresolvedArtifactNode = { name: call.split(/[:⁄]/).at(-1) || "undefined", exist: false, qualifiedName: call, type: "mcfunction"};
                        unresolvedNodes.push(undefinedNode);
                        node = undefinedNode;
                    }

                    // Create edges
                    edges.push({
                        srcQualifiedName: artifact.qualifiedName,
                        trgQualifiedName: node.qualifiedName
                    });
                }
            }
            console.log(resolvedNodes.get("as-animator:child/loop"));

            this.graph = {artifacts: [...resolvedNodes.values(), ...unresolvedNodes], calls: edges};
        }

        return this.graph!;
    }

    async preloadWorkspace(): Promise<void> {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if(workspaceFolders) {
            for(const workspace of workspaceFolders) {
                const datapacks = await this.preloadDatapacks(workspace.uri.fsPath);
                this.datapacks.push(...datapacks);
            }
        }
    }

    private async preloadDatapacks(dir: string): Promise<Datapack[]> {
        const dirEntries = await fs.promises.readdir(dir, { withFileTypes: true });

        // First case: the workspace is a datapack
        if(await this.isFolderADatapack(dir)) {
            const namespaces = await this.preloadNamespacesFromDatapack(dir);
            return [{ 
                namespaces: namespaces,
                name: path.basename(dir),
                path: dir
            }];
        // Second case: the workspace contains datapacks
        } else if(dirEntries.every(folder => this.isFolderADatapack(path.join(dir, folder.name)))) {
            const datapacks: Datapack[] = [];
            for await (const entry of dirEntries) {
                datapacks.push({ 
                    namespaces: await this.preloadNamespacesFromDatapack(path.join(dir, entry.name)),
                    name: entry.name,
                    path: path.join(dir, entry.name)
                }
                );
            }
            return datapacks;
        } else {
            vscode.window.showErrorMessage("No datapack found in the workspace " + dir);
            return [];
        }
    }

    private async isFolderADatapack(folderPath: string): Promise<boolean> {
        const dirEntries = await fs.promises.readdir(folderPath, { withFileTypes: true });
        return dirEntries.find(entry => entry.name === "data") !== undefined && dirEntries.find(entry => entry.name === "pack.mcmeta") !== undefined;
    }
    
    private async preloadNamespacesFromDatapack(datapackPath: string): Promise<UnloadedNamespace[]> {
        const dataFolder = path.join(datapackPath, "data");
        const dirEntries = await fs.promises.readdir(dataFolder, { withFileTypes: true });
        const namespaces: UnloadedNamespace[] = [];
        for(const entry of dirEntries) {
            if(entry.isDirectory()) {
                namespaces.push({ loaded: false, namespace: entry.name, path: path.join(dataFolder, entry.name) });
                this.allNamespaces.push(entry.name);
            }
        }
        return namespaces;
    }

    public getAllNamespaces(): NamespaceId[] {
        return this.datapacks.flatMap(dp => dp.namespaces.map(nms => { return {datapack: dp.name, namespace: nms.namespace};}));
    }

    public getAllLoadedNamespaces(): NamespaceId[] {
        return this.datapacks.flatMap(dp => dp.namespaces.filter(nms => nms.loaded).map(nms => { return {datapack: dp.name, namespace: nms.namespace};}));
    }

    public async loadNamespaces(...namespaces: NamespaceId[]) {

        const nmsName = namespaces.map(nms => nms.namespace);
        
        const namespacePathToLoad = this.datapacks.flatMap(dp => dp.namespaces)
                                                  .filter(nms => nmsName.includes(nms.namespace) && !nms.loaded)
                                                  .map(nms => nms.path);

        for(const dp of this.datapacks) {
            const newNamespaces: Namespace[] = [];
            for(const nms of dp.namespaces) {
                if(namespacePathToLoad.includes(nms.path)) {
                    const artifacts: MinecraftArtifact[] = [];
                     for await(const loader of this.artifactLoaders) {
                        const loadedArtifacts = await loader.load(nms.path);
                        artifacts.push(...loadedArtifacts);
                    }
                    newNamespaces.push({loaded: true, namespace: nms.namespace, path: nms.path, artifacts: artifacts});
                } else {
                    newNamespaces.push({loaded: false, namespace: nms.namespace, path: nms.path});
                }

            }
            dp.namespaces = newNamespaces;
        }
    }
    
}