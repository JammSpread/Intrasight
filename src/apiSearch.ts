import * as vscode from "vscode"
import { decodeHTML } from "./util"

interface IconPath {
	dark: string
	light: string
}

export abstract class APISearchProvider
	implements vscode.TreeDataProvider<APISearchResult> {
	constructor(public readonly query: string) {
		this.query = query.trim()
	}
	getTreeItem(
		element: APISearchResult,
	): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element
	}
	async getChildren(): Promise<APISearchResult[]> {
		if (this.query === "" || this.query === undefined) {
			return Promise.resolve([this.noResultsFallback()])
		}
		const items = this.processItems()
		if ((await items).length === 0) {
			return Promise.resolve([this.noResultsFallback()])
		}
		return items
	}
	/**
	 * Fetchs items from an API and return them.
	 */
	processItems(): Promise<APISearchResult[]> {
		return Promise.resolve([])
	}
	/**
	 * Returns TreeView response upon absence of results.
	 */
	noResultsFallback(): APISearchResult {
		return new APISearchResult("No results found!")
	}
}

export class APISearchResult extends vscode.TreeItem {
	public readonly contextValue = "searchResultItem"
	public readonly iconPath: IconPath

	constructor(label: string, public readonly url?: string) {
		super(decodeHTML(label), vscode.TreeItemCollapsibleState.None)
		this.command = {
			title: "",
			command: url ? "Intrasight.launch" : "",
			arguments: [url],
		}
	}
}
