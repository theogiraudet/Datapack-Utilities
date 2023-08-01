import { Edge, Node } from "reactflow";

export interface NamespaceId {
    datapack: string
    namespace: string
}

export interface Namespaces {
    allNamespaces: NamespaceId[]
    loadedNamespaces: NamespaceId[]
}

export function namespaceToString(namespace: NamespaceId) {
    return `${namespace.datapack}/${namespace.namespace}`
}

export interface Graph {
    nodes: Node[]
    edges: Edge[]
}
