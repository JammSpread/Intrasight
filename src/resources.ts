import * as vscode from "vscode"
import * as path from "path"
import { QueryProvider } from "./queryProvider"

class SearchEngine {
	querySyntax: string
	constructor(
		public readonly label: string,
		public readonly websiteURL: string,
		public readonly customQuerySyntax: string,
		public readonly icon: string,
	) {
		this.querySyntax = QueryProvider.getQuerySyntax(customQuerySyntax)
	}
}

export class ResourcesDataProvider
	implements vscode.TreeDataProvider<ResourcesModel> {
	getTreeItem(
		element: ResourcesModel,
	): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element
	}

	getChildren(): ResourcesModel[] {
		const engines = [
			{
				...new SearchEngine(
					"Google",
					"https://google.com",
					"/search?q=",
					"google.png",
				),
			},
			{
				...new SearchEngine(
					"DuckDuckGo",
					"https://duckduckgo.com",
					"/?q=",
					"duckduckgo.png",
				),
			},
			{
				...new SearchEngine(
					"YouTube",
					"https://youtube.com",
					"/results?search_query=",
					"youtube.png",
				),
			},
			{
				...new SearchEngine(
					"StackOverflow",
					"https://stackoverflow.com",
					"/search?q=",
					"stackoverflow.png",
				),
			},
			{
				...new SearchEngine(
					"MSDN",
					"https://social.msdn.microsoft.com",
					"/search/en-US?query=",
					"microsoft.png",
				),
			},
		]
		const menuItems: ResourcesModel[] = []
		const lang = QueryProvider.getLanguage()
		const query = QueryProvider.getSelectedText()
		const desc =
			QueryProvider.getLanguageForDescription() +
			QueryProvider.getSelectedText()
		engines.forEach(engine => {
			menuItems.push(
				new ResourcesModel(
					engine.label,
					engine.customQuerySyntax,
					engine.querySyntax,
					engine.websiteURL,
					lang,
					query,
					engine.icon,
					desc,
					vscode.TreeItemCollapsibleState.None,
					{
						command: "Resources.search",
						title: "",
						arguments: [engine.websiteURL, engine.querySyntax, lang, query],
					},
				),
			)
		})
		return menuItems
	}
}

class ResourcesModel extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly customQuerySyntax: string,
		public readonly querySyntax: string,
		public readonly websiteURL: string,
		public readonly language: string,
		public readonly query: string,
		public readonly icon: string,
		public readonly description: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command: vscode.Command,
	) {
		super(label, collapsibleState)
		this.iconPath = {
			dark: path.join(__filename, `../../Media/Dark/${this.icon}`),
			light: path.join(__filename, `../../Media/Light/${this.icon}`),
		}
	}
	contextValue = "MenuItem"
}
