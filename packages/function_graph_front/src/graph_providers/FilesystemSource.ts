import { convertGraphToFlow } from "./GraphConverter";
import { Graph, NamespaceId, Namespaces } from "../models/model";
import { data, namespaces } from "./data";
import DataManager from "./DataManager";
import { ArtifactEdge, ArtifactNode } from "../models/input_graph";

const regexDatapackAndNamespace = /datapacks\\(.+?)\\.*?\\(.+?)\\/

export class FilesystemSource implements DataManager {

    private readonly graphChangeListener: ((graph: Graph) => void)[] = [];
    private readonly namespaceChangeListener: ((loadedNamespaces: NamespaceId[], namespaces: NamespaceId[]) => void)[] = [];

    private readonly allNamespaces = namespaces.allNamespaces;
    private readonly loadedNamespaces = namespaces.loadedNamespaces;
    
    getInitialNamespaces(): Namespaces {
        return namespaces;
    }
    
    getGraphInitialState(): Graph {
        console.log(this.computeGraph())
        return this.computeGraph();
    }
    
    openFile(path: string): void {
        console.log("Open file " + path);
    }
    
    onNamespacesChange(fn: (loadedNamespaces: NamespaceId[], namespaces: NamespaceId[]) => void): void {
        this.namespaceChangeListener.push(fn);
    }

    onGraphChange(fn: (graph: Graph) => void): void {
        this.graphChangeListener.push(fn);
    }

    loadNamespaces(namespaces: NamespaceId[]): void {
        console.log(this.loadedNamespaces)
        this.loadedNamespaces.length = 0
        this.loadedNamespaces.push(...namespaces)
        console.log(this.loadedNamespaces)
        
        this.namespaceChangeListener.forEach(listener => listener(this.loadedNamespaces, this.allNamespaces))
        const newGraph = this.computeGraph()
        this.graphChangeListener.forEach(listener => listener(newGraph))
    }

    private computeGraph(): Graph {
        const allNodes: Map<string, ArtifactNode> = new Map()
        const concernedNodes: Map<string, ArtifactNode> = new Map()
        const concernedEdges: ArtifactEdge[] = []

        for(const nms of this.loadedNamespaces) {
            for(const artifact of data.artifacts) {
                if(artifact.exist) {
                    const group = regexDatapackAndNamespace.exec(artifact.path);
                    if(nms.datapack === group[1] && nms.namespace === group[2])  {
                        console.log(artifact)
                        concernedNodes.set(artifact.qualifiedName, artifact);
                    }
                }
                allNodes.set(artifact.qualifiedName, artifact)
            }
        }

        const unresolvedNodes: ArtifactNode[] = []

        for(const edge of data.calls) {
            if(concernedNodes.get(edge.srcQualifiedName)) {
                concernedEdges.push(edge)
                if(!concernedNodes.get(edge.trgQualifiedName)) {
                    const trgNode = allNodes.get(edge.trgQualifiedName)
                    unresolvedNodes.push({ exist: false, name: trgNode.name, qualifiedName: trgNode.qualifiedName, type: trgNode.type })
                }
            }
        }

        console.log(concernedNodes)

        return convertGraphToFlow({ artifacts: [...Array.from(concernedNodes.values()), ...unresolvedNodes], calls: concernedEdges });
    }

}