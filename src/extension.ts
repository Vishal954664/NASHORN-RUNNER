import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
  // Register the main command
  const runFunctionCommand = vscode.commands.registerCommand(
    'nashorn-runner.runFunction',
    async (functionName?: string) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage('No active editor!');
        return;
      }

      const filePath = editor.document.fileName;

      if (!functionName) {
        functionName = await vscode.window.showInputBox({
          placeHolder: 'Enter the function name to run',
        });
        if (!functionName) {
          vscode.window.showErrorMessage('No function name provided.');
          return;
        }
      }

      const params = await vscode.window.showInputBox({
        placeHolder: 'Enter parameters as JSON (object or array)',
        value: '{}'
      });

      if (params === undefined) {
        vscode.window.showErrorMessage('No parameters provided.');
        return;
      }

      const command = `java -cp . MyNashornRunner "${filePath}" "${functionName}" '${params}'`;

      exec(command, { cwd: context.extensionPath }, (err, stdout, stderr) => {
        if (err) {
          vscode.window.showErrorMessage(`Error: ${stderr}`);
          return;
        }
        vscode.window.showInformationMessage(`Result: ${stdout}`);
      });
    }
  );

  // Register CodeLens for JS files
  const codeLensProvider = vscode.languages.registerCodeLensProvider(
    { language: 'javascript' },
    new FunctionCodeLensProvider()
  );

  context.subscriptions.push(runFunctionCommand, codeLensProvider);
}

export function deactivate() {}

class FunctionCodeLensProvider implements vscode.CodeLensProvider {

  // Regex for normal function declarations
  private normalFunctionRegex = /function\s+([a-zA-Z0-9_]+)\s*\(([^\)]*)\)/g;

  // Regex for arrow functions: const name = (...) => {
  private arrowFunctionRegex = /const\s+([a-zA-Z0-9_]+)\s*=\s*\(([^\)]*)\)\s*=>/g;

  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const codeLenses: vscode.CodeLens[] = [];
    const text = document.getText();
    let matches;

    // Match normal functions
    while ((matches = this.normalFunctionRegex.exec(text)) !== null) {
      const functionName = matches[1];
      const params = matches[2];
      const line = document.positionAt(matches.index).line;

      const range = new vscode.Range(line, 0, line, 0);

      const cmd: vscode.Command = {
        title: `▶ Run function ${functionName}(${params})`,
        command: 'nashorn-runner.runFunction',
        arguments: [functionName]
      };

      codeLenses.push(new vscode.CodeLens(range, cmd));
    }

    // Match arrow functions
    while ((matches = this.arrowFunctionRegex.exec(text)) !== null) {
      const functionName = matches[1];
      const params = matches[2];
      const line = document.positionAt(matches.index).line;

      const range = new vscode.Range(line, 0, line, 0);

      const cmd: vscode.Command = {
        title: `▶ Run arrow ${functionName}(${params})`,
        command: 'nashorn-runner.runFunction',
        arguments: [functionName]
      };

      codeLenses.push(new vscode.CodeLens(range, cmd));
    }

    return codeLenses;
  }
}
