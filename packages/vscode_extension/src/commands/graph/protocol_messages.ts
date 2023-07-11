import { GraphType, NamespaceId } from "./models/models";

export type ReceivableQueryRegistry = {
    "graph_payload": AskGraphQuery
}

export type Query = SendGraphQuery<any> | SendNamespacesQuery | SendNamespacesQuery | AskGraphQuery;

export type SendGraphQuery<K extends keyof GraphType> = {
    payloadName: "graph_payload",
    graph: GraphType[K]
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
