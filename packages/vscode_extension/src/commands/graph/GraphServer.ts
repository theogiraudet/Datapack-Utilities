/* eslint-disable @typescript-eslint/naming-convention */
import { Disposable, Webview } from "vscode";
import { DatapackManager } from "./loaders/DatapackManager";
import { AskOpenFileQuery, LoadNamespaces, Query, ReceivableQueryRegistry, SendGraphQuery, SendNamespacesQuery, isQuery } from "./protocol_messages";
import * as vscode from 'vscode';

type PartialReceivableQueryRegistry = Partial<ReceivableQueryRegistry>;

type EventDispatcher = {
    [Key in keyof PartialReceivableQueryRegistry]: (query: ReceivableQueryRegistry[Key]) => void
};

export class GraphServer {

    private readonly datapackManager: DatapackManager;
    private readonly webview: Webview;

    private readonly dispatcher: EventDispatcher = {
        "init": () => { this.sendGraph();  this.sendNamespaces(); },
        "ask_open_file": (query: AskOpenFileQuery) => this.openFile(query),
        "load_namespaces": (query: LoadNamespaces) => this.loadNamespaces(query)
    };

    constructor(datapackManager: DatapackManager, webview: Webview) {
        this.datapackManager = datapackManager;
        this.webview = webview;
    }

    public dispatchEvents(): Disposable {
        return this.webview.onDidReceiveMessage(message => {
            if(isQuery(message)) {
                for(const [event, fun] of Object.entries(this.dispatcher)) {
                    if(message.payloadName === event) {
                        fun(message as any);
                    }
                }
            }
        });
    }

    private sendGraph() {
        const query: SendGraphQuery = { payloadName: "graph_payload", graph: this.datapackManager.getGraph() };
        this.webview.postMessage(query);
    }

    private sendNamespaces() {
        const query: SendNamespacesQuery = { payloadName: "namespaces_payload", loadedNamespaces: this.datapackManager.getAllLoadedNamespaces(), allNamespaces: this.datapackManager.getAllNamespaces() };
        this.webview.postMessage(query);
    }

    private openFile(query: AskOpenFileQuery) {
        const uri = vscode.Uri.file(query.filePath);
        vscode.workspace.openTextDocument(uri).then(doc => vscode.window.showTextDocument(doc, 1, false));
    }

    private loadNamespaces(query: LoadNamespaces) {
        this.datapackManager.loadNamespaces(...query.namespaces)
        .then(() => { this.sendNamespaces(); this.sendGraph(); });
    }
}
