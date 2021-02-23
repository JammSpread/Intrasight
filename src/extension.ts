import * as vscode from "vscode"
import { DocsDataProvider } from "./docs"
import { QueryProvider } from "./queryProvider"

export function activate(content: vscode.ExtensionContext) {
	// General

	vscode.commands.registerCommand("Intrasight.launch", URL =>
		vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(URL)),
	)

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
	vscode.window.registerTreeDataProvider("Menu4", DocsProvider)

	// StackOverflow Menu

	vscode.commands.registerCommand("StackOverflow.search", () =>
		QueryProvider.getUserInput().then(userQuery =>
			QueryProvider.refreshStackOverflowSearchTree(userQuery),
		),
	)

	QueryProvider.refreshStackOverflowSearchTree("")

	// GitHub Menu

	vscode.commands.registerCommand("GitHub.search", () =>
		QueryProvider.getUserInput().then(userQuery =>
			QueryProvider.refreshGitHubSearchTree(userQuery),
		),
	)

	QueryProvider.refreshGitHubSearchTree("")
}
