import * as vscode from "vscode"
import * as https from "https"
import * as path from "path"
import * as zlib from "zlib"

export class StackOverflowProvider
	implements vscode.TreeDataProvider<StackOverflowModel> {
	constructor(public readonly userQuery: string) {}

	getTreeItem(
		element: StackOverflowModel,
	): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element
	}

	getChildren(): Thenable<StackOverflowModel[]> {
		const menuArray: StackOverflowModel[] = []
		if (this.userQuery === "" || this.userQuery === undefined) {
			menuArray.push(this.returnNoResultsFound())
			return Promise.resolve(menuArray)
		}
		return new Promise((resolve, reject) => {
			const query = encodeURIComponent(this.userQuery)
			const config = vscode.workspace.getConfiguration(
				"Intrasight",
				vscode.window.activeTextEditor.document.uri,
			)
			const numDisplayResults = config.get(
				"StackOverflowNumberOfDisplayedResults",
				15,
			)
			const url = `https://api.stackexchange.com/2.2/search?page=1&pagesize=${numDisplayResults}&order=desc&sort=relevance&intitle=${query}&site=stackoverflow`
			https.get(url, res => {
				const gunzip = zlib.createGunzip()
				res.pipe(gunzip)
				let raw = ""
				gunzip
					.on("data", data => (raw += data))
					.on("end", () => {
						const { items } = JSON.parse(raw)
						if (items.length !== 0) {
							for (const arrIndex in items) {
								menuArray.push(
									new StackOverflowModel(
										items[arrIndex].title,
										"stackoverflow.png",
										vscode.TreeItemCollapsibleState.None,
										items[arrIndex].link,
										{
											command: "StackOverflow.launch",
											title: "",
											arguments: [items[arrIndex].link],
										},
									),
								)
							}
						} else {
							menuArray.push(this.returnNoResultsFound())
						}
						resolve(menuArray)
					})
					.on("error", err => {
						reject(err)
					})
			})
		})
	}

	returnNoResultsFound(): StackOverflowModel {
		return new StackOverflowModel(
			"No results found!",
			"stackoverflow.png",
			vscode.TreeItemCollapsibleState.None,
		)
	}
}

class StackOverflowModel extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly icon: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly url?: string,
		public readonly command?: vscode.Command,
	) {
		super(label, collapsibleState)
		this.iconPath = {
			dark: path.join(__filename, "..", "..", "Media", "Dark", this.icon),
			light: path.join(__filename, "..", "..", "Media", "Light", this.icon),
		}
	}
	contextValue = "searchResultItem"
}
