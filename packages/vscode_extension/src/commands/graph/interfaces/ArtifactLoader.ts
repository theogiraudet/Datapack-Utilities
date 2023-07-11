import * as vscode from "vscode";
import path = require("path");
import { MinecraftArtifact } from "../models/models";

export interface ArtifactLoader {

    getArtefactTypeName(): string;
    getArtefactRelativePath(): string;
    getArtefactFileExtension(): string;
    // TODO: Replace by a more generic type
    getQualifiedName(path: vscode.Uri): string;

    load(path: string): Promise<MinecraftArtifact[]>;
}