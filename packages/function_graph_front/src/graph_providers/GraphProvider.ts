import { Graph } from "../models/model"

export default interface GraphProvider {

    getInitialState(): Graph
    onChange(fn: (graph: Graph) => void): void

}