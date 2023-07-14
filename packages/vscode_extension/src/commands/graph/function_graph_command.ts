import * as vscode from 'vscode';
import * as path from 'path';
import { DatapackManager } from './loaders/DatapackManager';
import { McFunctionLoader } from './loaders/McFunctionLoader';
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
      const firtNamespaces = manager.getAllNamespaces().slice(0, 2);
      await manager.loadNamespaces(...firtNamespaces);
      webViewPanel.webview.html = await loadHtmlFile(context, webViewPanel);
      // const script = webViewPanel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'libs', 'function_graph', 'assets', 'main.js')));
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
  