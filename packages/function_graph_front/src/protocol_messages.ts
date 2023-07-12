import { D3Graph } from "./d3/D3Graph";
import { NamespaceId } from "./models/model";

export type Query = GetGraphQuery | GetNamespacesQuery | SendNamespacesQuery | AskGraphQuery;

export type GetGraphQuery = {
    payloadName: "graph_payload",
    graph: D3Graph
};

export type GetNamespacesQuery = {
    payloadName: "namespaces_payload",
    allNamespaces: NamespaceId[],
    loadedNamespaces: NamespaceId[]
};

export type SendNamespacesQuery = {
    payloadName: "load_namespaces_payload",
    namespacesToLoad: NamespaceId[]
};

export function isQuery(obj: any): obj is Query {
    return typeof obj === 'object' && "payloadName" in obj;
}

export type AskGraphQuery = {
    payloadName: "ask_graph"
}

