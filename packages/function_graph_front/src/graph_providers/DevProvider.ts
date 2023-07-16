import { convertGraphToFlow } from "./GraphConverter";
import { Graph } from "../models/model";
import { data } from "./data";
import GraphProvider from "./GraphProvider";

export class DevProvider implements GraphProvider {
    
    getInitialState(): Graph {
        return convertGraphToFlow(data);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    onChange(_fn: (graph: Graph) => void): void {}

}