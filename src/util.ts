import * as path from "path"

export function getIconPath(filename: string, theme: "Dark" | "Light") {
    return path.join(__filename, `../../Media/${theme}/${filename}`)
}
