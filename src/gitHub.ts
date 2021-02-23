import { Octokit } from "@octokit/rest"
import { APISearchProvider, APISearchResult } from "./apiSearch"
import { getIconPath } from "./util"
import * as config from "./config"
import { authentication } from "vscode"
import { QueryProvider } from "./queryProvider"

export class GitHubProvider extends APISearchProvider {
	private static accessToken?: string
	private static octokit?: Octokit
	private static rateLimited = false
	private static resetDate: Date

	processItems(): Promise<GitHubResult[]> {
		return new Promise(async resolve => {
			const itemArray: GitHubResult[] = []

			if (!GitHubProvider.octokit) {
				if (await this.createOctokit(itemArray, resolve)) {
					return
				}
			}

			// If currently rate limited show such and quit searching
			if (GitHubProvider.rateLimited) {
				itemArray.push(this.rateLimited())
				return resolve(itemArray)
			}

			const results = await GitHubProvider.octokit.search.repos({
				q: encodeURIComponent(this.query.substring(0, 256)),
				per_page: config.gitHubDisplayedResults,
			})

			const rate = (await GitHubProvider.octokit.rateLimit.get()).data.resources
				.search

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

			const rateModel = new GitHubResult(
				`Searched ${rate.limit - rate.remaining} time(s). ${
					rate.remaining
				} time(s) left.`,
			)

			rateModel.iconPath = undefined
			itemArray.push(rateModel)
			if (results.data.total_count === 0) {
				itemArray.push(this.noResultsFallback())
			} else {
				results.data.items.forEach(item => {
					itemArray.push(
						new GitHubResult(item.full_name, item.html_url, item.description),
					)
				})
			}

			resolve(itemArray)
		})
	}

	/**
	 * Create a new Octokit that may be authenticated with GitHub.
	 * Returns boolean indicating whether or not to quit search process.
	 * It does this because if authentication is attempted, then it notifies the user
	 * and to clear the TreeView after doing so you must refresh it
	 * (which creates a new GitHubProvider).
	 * @param itemArray The array of GitHubResult models that should be resolved.
	 * @param resolve The resolve method that updates the TreeView.
	 */
	async createOctokit(
		itemArray: GitHubResult[],
		resolve: (value: GitHubResult[]) => void,
	) {
		if (config.gitHubAuthentication) {
			// Notify the user of an attempt at authentication
			itemArray.push(
				new GitHubResult("Attempting to authenticate to fetch private repos."),
			)
			resolve(itemArray)

			GitHubProvider.accessToken = (
				await authentication.getSession("github", ["repo"], {
					createIfNone: true,
				})
			).accessToken
		}

		GitHubProvider.octokit = new Octokit({
			auth: GitHubProvider.accessToken,
		})

		if (config.gitHubAuthentication) {
			// If attempting authentication retry searching instead of continuing
			QueryProvider.refreshGitHubSearchTree(this.query)
			return true
		}

		return false
	}

	/**
	 * Returns a GitHubResult model that should be shown when rate limited by the GitHub REST API.
	 * The model shows to the user the remaining duration until the reset time.
	 */
	rateLimited(): GitHubResult {
		const remainingSeconds = Math.floor(
			(GitHubProvider.resetDate.getTime() - new Date().getTime()) / 1000,
		)
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
	constructor(
		label: string,
		public readonly url?: string,
		public readonly desc?: string,
	) {
		super(label, url)
	}
}
