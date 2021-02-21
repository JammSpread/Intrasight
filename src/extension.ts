import * as vscode from "vscode"
import { QueryProvider } from "./queryProvider"
import { DocsDataProvider } from "./docs"

export function activate(content: vscode.ExtensionContext) {
	// Search Resources Menu

	vscode.commands.registerCommand(
		"Resources.search",
		(websiteURL, querySyntax, language, query) => {
			vscode.commands.executeCommand(
				"vscode.open",
				vscode.Uri.parse(`${websiteURL}${querySyntax}${language}${query}`),
			)
		},
	)

	vscode.commands.registerCommand("Resources.customSearch", websiteQuery => {
		QueryProvider.getUserInput().then(userQuery => {
			if (userQuery) {
				userQuery = encodeURIComponent(userQuery)
				vscode.commands.executeCommand(
					"vscode.open",
					vscode.Uri.parse(
						`${websiteQuery.websiteURL}${websiteQuery.customQuerySyntax}${userQuery}`,
					),
				)
			}
		})
	})

	content.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection(
			QueryProvider.refreshResourcesTree,
		),
	)
	QueryProvider.refreshResourcesTree()

	// Docs Menu

	const DocsProvider = new DocsDataProvider()
	vscode.window.registerTreeDataProvider("Menu3", DocsProvider)
	vscode.commands.registerCommand("Docs.launch", websiteURL =>
		vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(websiteURL)),
	)

	// StackOverflow Menu

	vscode.commands.registerCommand("StackOverflow.search", () =>
		QueryProvider.getUserInput().then(userQuery =>
			QueryProvider.refreshStackOverflowSearchTree(userQuery),
		),
	)

	vscode.commands.registerCommand("StackOverflow.launch", Url =>
		vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(Url)),
	)

	QueryProvider.refreshStackOverflowSearchTree("")
}
