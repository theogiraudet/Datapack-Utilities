import * as vscode from 'vscode';
import * as path from 'path';
import { DatapackManager } from './loaders/DatapackManager';
import { McFunctionLoader } from './loaders/McFunctionLoader';
import { D3GraphRenderer } from './d3/D3GraphRenderer';
import { SendGraphQuery } from './protocol_messages';
import { D3Graph } from './d3/D3Graph';
import { GraphServer } from './GraphServer';

let server: GraphServer | undefined;

export async function displayGraphCommand(context: vscode.ExtensionContext) {
    const webViewPanel = vscode.window.createWebviewPanel(
        'functionGraph',
        'Function Graph',
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, 'libs', 'function_graph'))
          ],
          retainContextWhenHidden: true
        }
      );

      const manager = new DatapackManager([new McFunctionLoader()]);
      await manager.preloadWorkspace();
      const firtNamespace = manager.getAllNamespaces()[0];
      await manager.loadNamespaces(firtNamespace);
      // const graph = manager.exportToGraph(new D3GraphRenderer());
      // webViewPanel.webview.html = await loadHtmlFile(context, webViewPanel);
      webViewPanel.webview.html = getContent(webViewPanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'libs', 'function_graph'))).toString());
      // const query: SendGraphQuery<"d3"> = { payloadName: "graph_payload", graph: graph };
      // webViewPanel.webview.postMessage(query);
      server = new GraphServer(manager, webViewPanel.webview);
      server.dispatchEvents();
    }

async function loadHtmlFile(context: vscode.ExtensionContext, webViewPanel: vscode.WebviewPanel): Promise<string> {
    const htmlFilePath = vscode.Uri.file(path.join(context.extensionPath, 'libs', 'function_graph', 'index.html'));
    const htmlContent = (await vscode.workspace.fs.readFile(htmlFilePath)).toString();
  
    return htmlContent.replace(/(src|href)="(?!(?:[^"]*:|\/\/))(.*?)"/g, (_, p1, p2) => {
      return `${p1}="${webViewPanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'libs', 'function_graph', p2)))}"`;
    });
  }

function getContent(path: string): string {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <link rel="icon" href="${path}/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta
        name="description"
        content="Web site created using create-react-app"
      />
      <link rel="apple-touch-icon" href="${path}/logo192.png" />
      <link rel="manifest" href="${path}/manifest.json" />
      <title>React App</title>
    </head>
    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>
      <script>const vscode = acquireVsCodeApi();</script>
      <div id="root"></div>
      <script src="${scriptUri}"></script>
    </body>
  </html>
  `;
}
  