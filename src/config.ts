import * as vscode from "vscode"

const config = vscode.workspace.getConfiguration(
	"intrasight",
	vscode.window.activeTextEditor.document.uri,
)

export const docs = config.get("docs")
export const gitHubDisplayedResults: number = config.get(
	"gitHubDisplayedResults",
)
export const languageInQuery: boolean = config.get("includeLanguageInQuery")
export const showLanguageInDesc: boolean = config.get(
	"showLanguageInDescription",
)
export const stackOverflowDisplayedResults: number = config.get(
	"stackOverflowDisplayedResults",
)
