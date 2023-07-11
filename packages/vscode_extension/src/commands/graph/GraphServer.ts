/* eslint-disable @typescript-eslint/naming-convention */
import { Disposable, Webview } from "vscode";
import { DatapackManager } from "./loaders/DatapackManager";
import { AskGraphQuery, Query, ReceivableQueryRegistry, SendGraphQuery, isQuery } from "./protocol_messages";
import { D3GraphRenderer } from "./d3/D3GraphRenderer";

type PartialReceivableQueryRegistry = Partial<ReceivableQueryRegistry>;

type EventDispatcher = {
    [Key in keyof PartialReceivableQueryRegistry]: (query: ReceivableQueryRegistry[Key]) => void
};

export class GraphServer {

    private readonly datapackManager: DatapackManager;
    private readonly webview: Webview;

    private readonly dispatcher: EventDispatcher = {
        "graph_payload": this.getGraph
    };

    constructor(datapackManager: DatapackManager, webview: Webview) {
        this.datapackManager = datapackManager;
        this.webview = webview;
    }

    public dispatchEvents(): Disposable {
        return this.webview.onDidReceiveMessage(message => {
            console.log("Receive an event");
            if(isQuery(message)) {
                console.log("The event is a query");
                for(const [event, fun] of Object.entries(this.dispatcher)) {
                    if(message.payloadName === event) {
                        console.log("Execute query " + event);
                        fun(message as any);
                    }
                }
            }
        });
    }

    private getGraph() {
        console.log("Send graph");
        const query: SendGraphQuery<"d3"> = { payloadName: "graph_payload", graph: this.datapackManager.exportToGraph(new D3GraphRenderer()) };
        this.webview.postMessage(query);
    }
}