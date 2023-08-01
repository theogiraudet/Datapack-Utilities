import { Graph, GraphType, NamespaceId } from "./models/models";

export type ReceivableQueryRegistry = {
    "init": InitializationQuery,
    "ask_open_file": AskOpenFileQuery,
    "load_namespaces": LoadNamespaces
}

export type Query = SendGraphQuery | SendNamespacesQuery | SendNamespacesQuery | InitializationQuery | AskOpenFileQuery | LoadNamespaces;

export type SendGraphQuery = {
    payloadName: "graph_payload",
    graph: Graph.ArtifactGraph
};

export type SendNamespacesQuery = {
    payloadName: "namespaces_payload",
    allNamespaces: NamespaceId[],
    loadedNamespaces: NamespaceId[]
};

export type LoadNamespacesQuery = {
    payloadName: "load_namespaces_payload",
    namespacesToLoad: NamespaceId[]
};

export type InitializationQuery = {
    payloadName: "init"
}

export function isQuery(obj: any): obj is Query {
    return typeof obj === 'object' && "payloadName" in obj;
};

export type AskOpenFileQuery = {
    payloadName: "ask_open_file",
    filePath: string
};


export type AskNamespaces = {
    payloadName: "ask_namespaces",
};

export type LoadNamespaces = {
    payloadName: "load_namespaces",
    namespaces: NamespaceId[]
};

