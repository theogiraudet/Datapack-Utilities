/* eslint-disable @typescript-eslint/naming-convention */
import { Disposable, Webview } from "vscode";
import { DatapackManager } from "./loaders/DatapackManager";
import { AskGraphQuery, AskOpenFileQuery, Query, ReceivableQueryRegistry, SendGraphQuery, isQuery } from "./protocol_messages";
import * as vscode from 'vscode';

type PartialReceivableQueryRegistry = Partial<ReceivableQueryRegistry>;

type EventDispatcher = {
    [Key in keyof PartialReceivableQueryRegistry]: (query: ReceivableQueryRegistry[Key]) => void
};

export class GraphServer {

    private readonly datapackManager: DatapackManager;
    private readonly webview: Webview;

    private readonly dispatcher: EventDispatcher = {
        "ask_graph": () => this.getGraph(),
        "ask_open_file": (query: AskOpenFileQuery) => this.openFile(query)
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
        const query: SendGraphQuery = { payloadName: "graph_payload", graph: this.datapackManager.getGraph() };
        this.webview.postMessage(query);
    }

    private openFile(query: AskOpenFileQuery) {
        console.log(query.filePath);
        const uri = vscode.Uri.file(query.filePath);
        vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc, 1, false));
    }
}
