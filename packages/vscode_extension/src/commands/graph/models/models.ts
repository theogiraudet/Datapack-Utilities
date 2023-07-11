import { D3Graph } from "../d3/D3Graph";

export module Graph {

    export type ArtifactNode = ResolvedArtifactNode | UnresolvedArtifactNode;

    export type UnresolvedArtifactNode = {
        name: string
        exist: false
        qualifiedName: string
        type: string
    };

    export type ResolvedArtifactNode = {
        name: string
        exist: true
        qualifiedName: string
        path: string
        type: string
    };

    export type ArtifactEdge = {
        srcQualifiedName: string,
        trgQualifiedName: string,
        line?: number,
        column?: number
    };

    export type ArtifactGraph = {
        artifacts: ArtifactNode[]
        calls: ArtifactEdge[]
    };
}

export type MinecraftArtifact = {
    name: string
    qualifiedName: string
    path: string
    type: string
    calls: string[]
};

export type Namespace = UnloadedNamespace | LoadedNamespace;

export type UnloadedNamespace = {
    loaded: false,
    namespace: string,
    path: string
};

export type LoadedNamespace = {
    loaded: true,
    namespace: string,
    path: string,
    artifacts: MinecraftArtifact[]
};

export type Datapack = {
    name: string,
    namespaces: Namespace[],
    path: string
};

export type NamespaceId = {
    datapack: string,
    namespace: string
};

export type GraphType = {
    d3: D3Graph
};