import { convertGraphToFlow } from "./GraphConverter";
import { Graph } from "../models/model";
import { AskGraphQuery, isQuery } from "../protocol_messages";
import GraphProvider from "./GraphProvider";

export interface vscode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postMessage(message: any): void;
  }
  
  declare const vscode: vscode;

export default class VsCodeProvider implements GraphProvider {

    getInitialState(): Graph {
        return { edges: [], nodes: [] }
    }
    
    onChange(fn: (graph: Graph) => void): void {
        const askGraph: AskGraphQuery = {payloadName: 'ask_graph'};
        vscode.postMessage(askGraph);
        window.addEventListener('message', event => { 
            if(isQuery(event.data) && event.data.payloadName === 'graph_payload') {
                const { nodes, edges } = convertGraphToFlow(event.data.graph, vscode)
                fn({ nodes, edges })
            } 
        })
    }

}