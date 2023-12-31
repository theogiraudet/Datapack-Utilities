import { NamespaceId } from "./models/model";
import { ArtifactGraph } from "./models/input_graph";

export type Query = GetGraphQuery | GetNamespacesQuery | SendNamespacesQuery | InitializationQuery | AskOpenFileQuery | LoadNamespaces;

export type GetGraphQuery = {
    payloadName: "graph_payload",
    graph: ArtifactGraph
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

export type InitializationQuery = {
    payloadName: "init"
}

export type AskOpenFileQuery = {
    payloadName: "ask_open_file",
    filePath: string
}

export type LoadNamespaces = {
    payloadName: "load_namespaces",
    namespaces: NamespaceId[]
}