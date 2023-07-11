import * as vscode from 'vscode';
import { commands } from './commands/commands';

export function activate(context: vscode.ExtensionContext) {
  Object.entries(commands).forEach(entry => context.subscriptions.push(vscode.commands.registerCommand(entry[0], () => entry[1](context))));
}