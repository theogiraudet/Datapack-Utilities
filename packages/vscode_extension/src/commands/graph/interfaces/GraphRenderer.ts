import { Graph, GraphType } from "../models/models";

export interface GraphRenderer<T extends keyof GraphType>  {
    generateGraph(graph: Graph.ArtifactGraph): GraphType[T];
}