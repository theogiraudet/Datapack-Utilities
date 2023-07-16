import { Edge, Node } from "reactflow";

export type NamespaceId = {
    datapack: string,
    namespace: string
};

export interface Graph {
    nodes: Node[]
    edges: Edge[]
}
