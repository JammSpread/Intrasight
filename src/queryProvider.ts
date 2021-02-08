import { ResourcesDataProvider } from "./resources"
import { SelectedTextModel } from "./SelectedTextModel"
import { StackOverflowProvider } from "./stackOverflow"
import * as vscode from "vscode"

export class QueryProvider {
	private static getTextPosition(
		editor: vscode.TextEditor | undefined,
	): SelectedTextModel {
		let text: any = []
		if (editor) {
			text = editor.selection
		}
		return new SelectedTextModel(text)
	}

	static getSelectedText(): string {
		const selection = this.getTextPosition(vscode.window.activeTextEditor)
		const data = vscode.window.activeTextEditor.document.getText(
			new vscode.Range(
				new vscode.Position(selection.lineStart, selection.indexStart),
				new vscode.Position(selection.lineEnd, selection.indexEnd),
			),
		)
		return data
	}

	static getLanguage(): string {
		if (this.getSelectedText() === "") {
			return ""
		}
		return `${vscode.window.activeTextEditor.document.languageId}+`
	}

	static getLanguageForDescription(): string {
		if (this.getSelectedText() === "") {
			return ""
		}
		return `${vscode.window.activeTextEditor.document.languageId}: `
	}

	static getQuerySyntax(syntax: string): string {
		if (this.getSelectedText() === "") {
			return ""
		}
		return syntax
	}

	static refreshResourcesTree() {
		vscode.window.registerTreeDataProvider("Menu1", new ResourcesDataProvider())
	}

	static refreshStackOverflowSearchTree(userQuery: string | undefined) {
		vscode.window.registerTreeDataProvider(
			"Menu2",
			new StackOverflowProvider(userQuery),
		)
	}

	static getUserInput(): Thenable<string> {
		return vscode.window.showInputBox({
			prompt: "Enter Search Query!",
			placeHolder: "ex: Python print() function",
			ignoreFocusOut: true,
		})
	}
}
