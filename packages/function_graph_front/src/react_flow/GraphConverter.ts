import { CircleNode, Color } from "./CircleNode";
import { ArtifactGraph } from "./graph";

export function convertGraphToFlow(graph: ArtifactGraph): CircleNode[] {
    const nodes: CircleNode[] = [];
    for(const node of graph.artifacts) {
        const color: Color = node.exist ? "default" : "red";
        const nd: CircleNode = { id: node.qualifiedName, position: { x: 0, y: 0 }, type: 'circle', data: { color: color, fade: false }, draggable: false };
        nodes.push(nd);
    }
    return nodes;
}