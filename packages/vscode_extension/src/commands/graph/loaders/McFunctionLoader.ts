import { ArtifactLoader } from "../interfaces/ArtifactLoader";
import * as vscode from "vscode";
import * as fs from "fs";
import path = require("path");
import { MinecraftArtifact } from "../models/models";

const importantPathFragmentsForMcPath = /datapacks\/[^\/]+\/data\/([0-9a-z\-_]+)\/functions\/([^.]+)/;
const functionRegex = /(^|run |\")(function|schedule) ([a-z0-9-/:_]+)/;

export class McFunctionLoader implements ArtifactLoader {
  
  getArtefactTypeName(): string {
    return "McFunction";
  }
  getArtefactRelativePath(): string {
    return "data/*/functions";
  }
  getArtefactFileExtension(): string {
    return ".mcfunction";
  }

  getQualifiedName(path: vscode.Uri): string {
    const results = importantPathFragmentsForMcPath.exec(path.path);
    const namespace = results?.at(-2);
    const relativePath = results?.at(-1);
    return `${namespace}:${relativePath}`;
  }

  /**
 * @param path the path of a namespace
 * @returns 
 */
  async load(path: string): Promise<MinecraftArtifact[]> {
    const functionArtifacts = await this.getAllArtifacts(path);
    return functionArtifacts;
    // const callsArray: ArtifactEdge[] = [];

    // const functionArtifactsMap: Map<string, ResolvedArtifact> = new Map();
    // const unresolvedArtifacts: Map<string, UnresolvedArtifact> = new Map();

    // functionArtifacts.forEach((fa) =>
    //   functionArtifactsMap.set(fa.qualifiedName, fa)
    // );

    // for await (const fn of functionArtifacts) {
    //   const calls = await this.extractFunctionCalls(fn.path);
    //   const src: Artifact = functionArtifactsMap.get(fn.qualifiedName)!;
    //   for (const trg of calls) {
    //     const trgArtifact: Artifact = functionArtifactsMap.get(trg) || this.toUnresolved(trg);
    //     if (trgArtifact.exist === false && !unresolvedArtifacts.get(trgArtifact.qualifiedName)) {
    //       unresolvedArtifacts.set(trgArtifact.qualifiedName, trgArtifact);
    //     }
    //     callsArray.push({ srcQualifiedName: src.qualifiedName, trgQualifiedName: trgArtifact.qualifiedName });
    //   }
    // }

    // return {
    //   artifacts: [...functionArtifacts, ...unresolvedArtifacts.values()],
    //   calls: Array.from(callsArray),
    // };
  }

  /**
   * @param filePath an path to a McFunction file.
   * @returns All function calls in the specified file.
   */
  private async extractFunctionCalls(filePath: string): Promise<string[]> {
    const calls: string[] = [];
    const content = await fs.promises.readFile(filePath, { encoding: "utf8" });
    const lines = content.split(/(\r)?\n/);
    for (const line of lines) {
      const results = functionRegex.exec(line);
      const functionCall = results?.at(-1);
      if (functionCall) {
        calls.push(functionCall);
      }
    }
    return calls;
  }

  private async getAllArtifacts(root: string): Promise<MinecraftArtifact[]> {
    const files: MinecraftArtifact[] = [];
    if(fs.statSync(root).isFile()) {
      files.push({ 
        path: root, 
        qualifiedName: this.getQualifiedName(vscode.Uri.file(root)), 
        type: this.getArtefactTypeName(), 
        name: path.basename(root), 
        calls: await this.extractFunctionCalls(root)
    });
    } else {
      const dirEntries = await fs.promises.readdir(root, { withFileTypes: true });
      for (const dirEntry of dirEntries) {
        const fullPath = path.join(root, dirEntry.name);
    
        if (dirEntry.isFile() && dirEntry.name.endsWith(this.getArtefactFileExtension())) {
          files.push({ 
              path: fullPath, 
              qualifiedName: this.getQualifiedName(vscode.Uri.file(fullPath)), 
              type: this.getArtefactTypeName(), 
              name: dirEntry.name, 
              calls: await this.extractFunctionCalls(fullPath)
          });
        } else if (dirEntry.isDirectory()) {
          const subFiles = await this.getAllArtifacts(fullPath);
          files.push(...subFiles);
        }
      }
    }
    
    return files;
  }
}
