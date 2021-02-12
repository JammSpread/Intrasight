import axios from "axios"
import * as vscode from "vscode"
import { APISearchProvider, APISearchResult } from "./apiSearch"
import { getIconPath } from "./util"

export class StackOverflowProvider extends APISearchProvider {
	processItems(): Promise<StackOverflowResult[]> {
		return new Promise(async resolve => {
			const itemArray: StackOverflowResult[] = []
			const query = encodeURIComponent(this.query)
			const config = vscode.workspace.getConfiguration(
				"Intrasight",
				vscode.window.activeTextEditor.document.uri,
			)
			const numDisplayResults = config.get(
				"StackOverflowNumberOfDisplayedResults",
				15,
			)
			const api = `https://api.stackexchange.com/2.2/search?page=1&pagesize=${numDisplayResults}&order=desc&sort=relevance&intitle=${query}&site=stackoverflow`
			const res = await axios(api)
			const { items } = res.data
			if (items.length !== 0) {
				for (const arrIndex in items) {
					const item = items[arrIndex]
					itemArray.push(new StackOverflowResult(item.title, item.link))
				}
			}
			resolve(itemArray)
		})
	}

	noResultsFallback(): StackOverflowResult {
		return new StackOverflowResult("No results found!")
	}
}

export class StackOverflowResult extends APISearchResult {
	public readonly iconPath = {
		dark: getIconPath("stackoverflow.png", "dark"),
		light: getIconPath("stackoverflow.png", "light"),
	}
	constructor(label: string, public readonly url?: string) {
		super(label, url, "StackOverflow.launch")
	}
}
