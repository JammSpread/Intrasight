import * as vscode from "vscode"

const config = vscode.workspace.getConfiguration(
	"intrasight",
	vscode.window.activeTextEditor.document.uri,
)

export const docs = config.get("docs")
export const stackOverflowDisplayedResults = config.get(
	"stackOverflowDisplayedResults",
)
