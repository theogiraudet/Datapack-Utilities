import { GraphRenderer } from "../interfaces/GraphRenderer";
import { Graph } from "../models/models";
import { D3Graph } from "./D3Graph";

export class D3GraphRenderer implements GraphRenderer<"d3"> {
    
    generateGraph(graph: Graph.ArtifactGraph): D3Graph {
        const d3Graph = new D3Graph();
        const resolvedId = d3Graph.addCategory("Resolved");
        const unresolvedId = d3Graph.addCategory("Unresolved");

        graph.artifacts.forEach(node => d3Graph.addNode(node.qualifiedName, node.exist ? resolvedId : unresolvedId));
        graph.calls.forEach(call => d3Graph.addEdge(call.srcQualifiedName, call.trgQualifiedName));
        
        return d3Graph;
    }

}