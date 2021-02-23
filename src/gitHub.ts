import { Octokit } from "@octokit/rest"
import { APISearchProvider, APISearchResult } from "./apiSearch"
import { getIconPath } from "./util"
import * as config from "./config"

export class GitHubProvider extends APISearchProvider {
	private static readonly octokit = new Octokit()
	private static rateLimited = false
	private static resetDate: Date

	processItems(): Promise<GitHubResult[]> {
		return new Promise(async resolve => {
			const itemArray: GitHubResult[] = []

			// If currently rate limited show such and quit searching
			if (GitHubProvider.rateLimited) {
				itemArray.push(this.rateLimited())
				return resolve(itemArray)
			}

            const search = await GitHubProvider.octokit.search.repos({
				q: encodeURIComponent(this.query.substring(0, 256)),
				per_page: config.gitHubDisplayedResults
			})
			
			const rate = (await GitHubProvider.octokit.rateLimit.get()).data.resources.search
			
			// Handle the rate being limited with a timeout set until the reset time is hit
			if (rate.remaining <= 0) {
				GitHubProvider.rateLimited = true
				const duration = rate.reset * 1000 - new Date().getTime()

				setTimeout(() => {
					GitHubProvider.rateLimited = false
				}, duration)
				GitHubProvider.resetDate = new Date(rate.reset * 1000)
				itemArray.push(this.rateLimited())

				return resolve(itemArray)
			}

			const rateModel = new GitHubResult(`Searched ${rate.limit - rate.remaining} time(s). ${rate.remaining} time(s) left.`)

			rateModel.iconPath = undefined
			itemArray.push(rateModel)
			if (search.data.total_count === 0) {
				itemArray.push(this.noResultsFallback())
			}
			else {
            	search.data.items.forEach(item => {
            	    itemArray.push(new GitHubResult(item.full_name, item.html_url, item.description))
				})
			}

			resolve(itemArray)
        })
	}

	/**
	 * Returns a GitHub Result model that should be shown when rate limited by the GitHub REST API.
	 * The model shows to the user the time until the reset time.
	 */
	rateLimited(): GitHubResult {
		const remainingSeconds = Math.floor((GitHubProvider.resetDate.getTime() - new Date().getTime()) / 1000)
		const label = `Rate limited! Please wait ${remainingSeconds} seconds.`
		return new GitHubResult(label)
	}

	noResultsFallback(): GitHubResult {
		return new GitHubResult("No results found!")
	}
}

export class GitHubResult extends APISearchResult {
	public iconPath = {
		dark: getIconPath("github.png", "dark"),
		light: getIconPath("github.png", "light"),
	}
	constructor(label: string, public readonly url?: string, public readonly desc?: string) {
		super(label, url)
	}
}
