import * as vscode from "vscode"
import { getIconPath } from "./util"
import * as config from "./config"

interface Documentation {
	label: string
	websiteURL: string
	icon: string
}

export class DocsDataProvider implements vscode.TreeDataProvider<DocsModel> {
	getTreeItem(element: DocsModel): vscode.TreeItem | Thenable<vscode.TreeItem> {
		return element
	}

	getChildren(): DocsModel[] {
		const docs: Documentation[] = <any>config.docs
		const menuItems: DocsModel[] = []
		docs.forEach(doc => {
			menuItems.push(
				new DocsModel(doc.label, doc.websiteURL, doc.icon, {
					command: "Docs.launch",
					title: "",
					arguments: [doc.websiteURL],
				}),
			)
		})
		return menuItems
	}
}

class DocsModel extends vscode.TreeItem {
	constructor(
		label: string,
		public readonly websiteURL: string,
		public readonly icon: string,
		public readonly command: vscode.Command,
	) {
		super(label, vscode.TreeItemCollapsibleState.None)
		this.iconPath = {
			dark: getIconPath(this.icon, "dark"),
			light: getIconPath(this.icon, "light"),
		}
	}
}
