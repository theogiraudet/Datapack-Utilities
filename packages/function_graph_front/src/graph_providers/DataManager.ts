import { Graph, NamespaceId, Namespaces } from "../models/model"

export default interface DataManager {

    getGraphInitialState(): Graph
    getInitialNamespaces(): Namespaces
    onGraphChange(fn: (graph: Graph) => void): void
    onNamespacesChange(fn: (loadedNamespaces: NamespaceId[], namespaces: NamespaceId[]) => void): void
    openFile(path: string): void
    loadNamespaces(namespaces: NamespaceId[]): void

}