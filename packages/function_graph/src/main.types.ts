export type GraphNode = {
    name    : string
    id      : string | number
    category: number
}

export type GraphEdge = {
    source  : number
    target  : number
}

export type GraphCategory = {
    category: number
    value   : number
    name    : string
    base    : string
}