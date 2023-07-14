import { Graph, GraphType, NamespaceId } from "./models/models";

export type ReceivableQueryRegistry = {
    "ask_graph": AskGraphQuery,
    "ask_open_file": AskOpenFileQuery
}

export type Query = SendGraphQuery | SendNamespacesQuery | SendNamespacesQuery | AskGraphQuery | AskOpenFileQuery;

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

export type AskGraphQuery = {
    payloadName: "ask_graph"
};

export function isQuery(obj: any): obj is Query {
    return typeof obj === 'object' && "payloadName" in obj;
};

export type AskOpenFileQuery = {
    payloadName: "ask_open_file",
    filePath: string
};

