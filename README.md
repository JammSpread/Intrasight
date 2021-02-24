<h1 align="center">
	<img src="https://github.com/JammSpread/Intrasight/blob/master/media/icon.png?raw=true" alt="intrasight" width="200">
	<br>
	Intrasight: Search in VSCode
</h1>

_Based on and forked from [Insight](https://marketplace.visualstudio.com/items?itemName=TMcGinn.insight) by [TMcGinn](https://marketplace.visualstudio.com/publishers/TMcGinn)_

## Description

A VS Code extension for quick access and smart queries of developer resources such as Google, StackOverflow and YouTube as well as documentation for popular languages and frameworks.

## Features

- Launch popular sites right from VSCode (including popular language/framework docs)
- Search what you're highlighting
- Search custom terms within your editor

## Examples

**Search Highlighted Text**

> **TIP:** Highlight language keywords for best results.

![Highlight Search](https://github.com/JammSpread/Intrasight/blob/master/media/highlightSearch.gif?raw=true)

**Custom Search**

![Custom Search](https://github.com/JammSpread/Intrasight/blob/master/media/customSearch.gif?raw=true)

**Search StackOverflow**

> **NOTE:** The search results of StackOverflow API aren't as good as a search on **stackoverflow.com**.

![StackOverflow Search](https://github.com/JammSpread/Intrasight/blob/master/media/stackOverflowSearch.gif?raw=true)

**Documentation List**

![Documentation](https://github.com/JammSpread/Intrasight/blob/master/media/documentation.gif?raw=true)

## Extension Settings

```jsonc
{
	// The user-specified amount of results that should show up on search in-editor.
	"intrasight.stackOverflowDisplayedResults": 15,
	"intrasight.gitHubDisplayedResults": 15,
	// The documentation sources to be listed in the Intrasight sidebar.
	"intrasight.docs": [
		{
			"label": "Webpack",
			"websiteURL": "https://webpack.js.org/concepts/",
			"icon": "/home/Downloads/webpack.png"
		}
	],
	// Whether the file language show be included in search queries.
	// (may help increase search specificity)
	"intrasight.includeLanguageInQuery": true,
	// Whether the file language should be shown next to search resources.
	"intrasight.showLanguageInDescription": true,
	// Whether GitHub Search automatically authenticates so it can fetch private repositories.
	"intrasight.gitHubAuthentication": true
}
```

## Release Notes

### 1.0.1

- Added documentation links for Express, React, Angular, Bootstrap, Sass, Gatsby, GraphQL, React Navive, Ionic

## Issues

### Please submit any issues or suggestions [here](https://github.com/JammSpread/Intrasight/issues).

## Contribution

### Fork the [repo](https://github.com/JammSpread/Intrasight) and submit pull requests.
