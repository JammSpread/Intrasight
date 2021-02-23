import * as vscode from "vscode"
import * as config from "./config"
import { getIconPath } from "./util"

interface Documentation {
	label: string
	websiteURL: string
	icon: string
	darkIcon?: string
	lightIcon?: string
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
				new DocsModel(
					doc.label,
					doc.websiteURL,
					doc.icon,
					{
						command: "Intrasight.launch",
						title: "",
						arguments: [doc.websiteURL],
					},
					doc.darkIcon,
					doc.lightIcon,
				),
			)
		})
		return menuItems
	}
}

class DocsModel extends vscode.TreeItem {
	constructor(
		label: string,
		public readonly websiteURL: string,
		icon: string,
		public readonly command: vscode.Command,
		darkIcon?: string,
		lightIcon?: string,
	) {
		super(label, vscode.TreeItemCollapsibleState.None)
		if (icon.startsWith("/") || icon.includes(":")) {
			this.iconPath = icon
		} else {
			this.iconPath = {
				dark: icon ? getIconPath(icon, "dark") : darkIcon,
				light: icon ? getIconPath(icon, "light") : lightIcon,
			}
		}
	}
}
