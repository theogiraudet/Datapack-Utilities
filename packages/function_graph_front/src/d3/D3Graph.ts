export class D3Graph {
    type = "force";
    categories: GraphCategory[] = [];
    nodes: GraphNode[] = [];
    edges: GraphLink[] = [];
}



export interface GraphCategory {
    category: number
    value: number
    name: string
    base: string
}

export interface GraphNode {
    name: string
    id: string
    category: number
}

export interface GraphLink {
    source: number
    target: number
}