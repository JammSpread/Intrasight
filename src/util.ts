import * as path from "path"

export function getIconPath(filename: string, theme: "Dark" | "Light") {
	return path.join(__filename, `../../Media/${theme}/${filename}`)
}

// Map of HTML character entities
const entities = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: `"`,
	"#0x27": "\\",
	"#x27": "\\",
	"#0x60": "`",
	"#x60": "`",
}

export function decodeHTML(str: string) {
	return str.replace(/&(#?\w+);?/g, (sub, arg: string) => {
		if (<Object>entities.hasOwnProperty(arg)) {
			return entities[arg] || sub
		}
		const hex = arg.search(/x/g)
		const n = parseInt(
			arg.substring(hex === -1 ? 1 : hex + 1),
			hex === -1 ? 10 : 16,
		)
		return !isNaN(n) ? String.fromCharCode(n) : sub
	})
}
