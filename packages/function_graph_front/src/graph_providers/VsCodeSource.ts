import { convertGraphToFlow } from "./GraphConverter";
import { Graph, NamespaceId, Namespaces } from "../models/model";
import { InitializationQuery, LoadNamespaces, isQuery } from "../protocol_messages";
import DataManager from "./DataManager";

export interface vscode {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postMessage(message: any): void;
  }
  
  declare const vscode: vscode;

export default class VsCodeSource implements DataManager {
    
    private readonly graphChangeListener: ((graph: Graph) => void)[] = [];
    private readonly namespaceChangeListener: ((loadedNamespaces: NamespaceId[], namespaces: NamespaceId[]) => void)[] = [];

    constructor() {
        const askGraph: InitializationQuery = {payloadName: 'init'};
        vscode.postMessage(askGraph);
        window.addEventListener('message', event => { 
            if(isQuery(event.data)) {
                if(event.data.payloadName === 'graph_payload') {
                    console.log(event.data.graph)
                    const graph = convertGraphToFlow(event.data.graph, vscode)
                    this.graphChangeListener.forEach(fn => fn(graph))
                } else if(event.data.payloadName === "namespaces_payload") {
                    console.log(event.data)
                    const { loadedNamespaces, allNamespaces } = event.data
                    this.namespaceChangeListener.forEach(fn => fn(loadedNamespaces, allNamespaces))
                }
            } 
        })
    }
    loadNamespaces(namespaces: NamespaceId[]): void {
        const query: LoadNamespaces = { payloadName: "load_namespaces", namespaces: namespaces }
        vscode.postMessage(query)
    }
    openFile(path: string): void {
        vscode.postMessage({ payloadName: "ask_open_file", filePath: path })
    }
    getInitialNamespaces(): Namespaces {
        return { allNamespaces: [], loadedNamespaces: [] }
    }

    onNamespacesChange(fn: (loadedNamespaces: NamespaceId[], namespaces: NamespaceId[]) => void): void {
        this.namespaceChangeListener.push(fn);
    }

    getGraphInitialState(): Graph {
        return { edges: [], nodes: [] }
    }
    
    onGraphChange(fn: (graph: Graph) => void): void {
        this.graphChangeListener.push(fn);
    }

}