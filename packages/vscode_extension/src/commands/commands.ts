/* eslint-disable @typescript-eslint/naming-convention */
import { VsCodeCommands } from "./commands.types";
import { displayGraphCommand } from "./graph/function_graph_command";

export const commands: VsCodeCommands = {
    "du.dispGraph": displayGraphCommand,
};