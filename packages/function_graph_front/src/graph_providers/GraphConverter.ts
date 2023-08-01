import { Edge, Node, MarkerType } from "reactflow";
import { Color } from "../custom_components/CircleNode";
import { ArtifactGraph, ResolvedArtifactNode } from "../models/input_graph";
import { vscode } from "./VsCodeSource"

export function convertGraphToFlow(graph: ArtifactGraph, vscode?: vscode): { nodes: Node[], edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const edgeMap: Map<string, Edge[]> = new Map()
    
    let int = 0;
    for(const edge of graph.calls) {
        const edgeStruct = { id: `${int}`, source: edge.srcQualifiedName, target: edge.trgQualifiedName, markerEnd: { type: MarkerType.ArrowClosed }, type: "floating" }
        edges.push(edgeStruct);
        const array = edgeMap.get(edgeStruct.source) || [];
        array.push(edgeStruct);
        edgeMap.set(edgeStruct.source, array);
        int++;
    }

    for(const node of graph.artifacts) {
        const color: Color = node.exist ? "default" : "undefined";
        const filePath = (node as any)["path"] ? (node as ResolvedArtifactNode).path : undefined
        const nd: Node = { id: node.qualifiedName, position: { x: 0, y: 0 }, type: 'circle', 
        data: { color: color, fade: false, vscode: vscode, filePath: filePath }, 
        draggable: true };
        nodes.push(nd);
    }

    return { nodes, edges };
}