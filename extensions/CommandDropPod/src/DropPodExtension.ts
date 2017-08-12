/*
 * Copyright 2017 Simon Edwards <simon@simonzone.com>
 *
 * This source code is licensed under the MIT license which is detailed in the LICENSE.txt file.
 */
import {CommandEntry, ExtensionContext, Logger, Terminal} from 'extraterm-extension-api';
import {BashScriptBuilder, FishScriptBuilder, ZshScriptBuilder} from './ScriptBuilders';


let log: Logger = null;

export function activate(context: ExtensionContext): any {
  log = context.logger;
  context.workspace.registerCommandsOnTerminal(terminalCommandLister, terminalCommandExecutor);
}

const COMMAND_DROP_BASH_COMMAND_POD = "dropBashCommandPod";
const COMMAND_DROP_FISH_COMMAND_POD = "dropFishCommandPod";
const COMMAND_DROP_ZSH_COMMAND_POD = "dropZshCommandPod";

function terminalCommandLister(terminal: Terminal): CommandEntry[] {
  return [{
    id: COMMAND_DROP_BASH_COMMAND_POD,
    label: "Drop Command Pod (bash)"
  },
  {
    id: COMMAND_DROP_FISH_COMMAND_POD,
    label: "Drop Command Pod (fish)"
  },
  {
    id: COMMAND_DROP_ZSH_COMMAND_POD,
    label: "Drop Command Pod (zsh)"
  }];
}

async function terminalCommandExecutor(terminal: Terminal, commandId: string, commandArguments?: object): Promise<any> {
  let script = "";
  switch(commandId) {
    case COMMAND_DROP_BASH_COMMAND_POD:
      script = new BashScriptBuilder(terminal.getExtratermCookieName(), terminal.getExtratermCookieValue()).build();
      break;

    case COMMAND_DROP_FISH_COMMAND_POD:
      script = new FishScriptBuilder(terminal.getExtratermCookieName(), terminal.getExtratermCookieValue()).build();
      break;

    case COMMAND_DROP_ZSH_COMMAND_POD:
      script = new ZshScriptBuilder(terminal.getExtratermCookieName(), terminal.getExtratermCookieValue()).build();
      break;

    default:
      return;
  }
  terminal.type(normalizeCarriageReturns(script));
}

function normalizeCarriageReturns(text: string): string {
  return text.replace(/\n/g, '\r');
}
