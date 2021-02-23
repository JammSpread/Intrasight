import axios from "axios"
import { APISearchProvider, APISearchResult } from "./apiSearch"
import { getIconPath } from "./util"
import * as config from "./config"
import { QueryProvider } from "./queryProvider"

export class StackOverflowProvider extends APISearchProvider {
	processItems(): Promise<StackOverflowResult[]> {
		return new Promise(async resolve => {
			const itemArray: StackOverflowResult[] = []
			const lang = encodeURIComponent(
				config.languageInQuery ? QueryProvider.getLanguage() : "",
			)
			const query = encodeURIComponent(this.query)
			const api = `https://api.stackexchange.com/2.2/search?page=1&pagesize=${config.stackOverflowDisplayedResults}&order=desc&sort=relevance&intitle=${query}&site=stackoverflow&tagged=${lang}`
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
		super(label, url)
	}
}
