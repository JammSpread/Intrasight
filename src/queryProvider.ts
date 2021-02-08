import { ResourcesDataProvider } from "./resources"
import { StackOverflowProvider } from "./stackOverflow"
import * as vscode from "vscode"

export class QueryProvider {
	static getSelectedText(): string {
		const editor = vscode.window.activeTextEditor
		if (editor) {
			return editor.document.getText(editor.selection)
		}
		return ""
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
			placeHolder: "Search",
			ignoreFocusOut: true,
		})
	}
}
