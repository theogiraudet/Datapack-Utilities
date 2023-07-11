import * as vscode from 'vscode';

export type VsCodeCommands = {
    [command: string]: (() => any) | ((context: vscode.ExtensionContext) => any)
};