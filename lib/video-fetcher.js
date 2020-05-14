const https = require('https');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

const axios = require('axios');
const cheerio = require('cheerio');

const CookieStore = require('../lib/cookie-store');

class VideoFetcher {
	constructor() {
		this.cookieStore = new CookieStore();
		this.userAgentPath = '../data/Chrome-User-Agents.txt';
		this.youtubeSearchUrl = 'https://www.youtube.com/results';
		this.youtubeBaseUrl = 'https://www.youtube.com';
		this.cookieJar = '';
		return new Promise(async (resolve, reject) => {
			this.userAgents = await this.readFileToArray(this.userAgentPath);
			this.cookieStore.fetchCookieJSON();
			await this.cookieStore.buildCookieJar();
			this.cookieJar = this.cookieStore.getCookieJar();
			resolve(this);
		});
	}

	setSearchTerms(searchTerms) {
		this.searchTerms = searchTerms.slice(0,6);
	}

	getYoutubeLinks(page) {
		return new Promise((resolve, reject) => {
			const requestPromises = [];
			for (let i = 0; i < this.searchTerms.length; i++) {
				const searchTerm = this.searchTerms[i];
				const searchTermQuery = searchTerm.split(' ').join('+');
				const youtubeSearch = async () => {
					return axios({
						url: `${this.youtubeSearchUrl}?search_query=${searchTermQuery}&page=${page}`,
						method: 'GET',
						headers: {
							'User-Agent': this.getRandomArrayItem(this.userAgents),
							'Set-Cookie': this.cookieJar
						}
					}).catch((err) => {
						// console.log("Request Error:", err);
					});
				};
				requestPromises.push(youtubeSearch());
			}

			Promise.all(requestPromises).then((responses) => {
				let videoLinks = [];
				responses.forEach((response) => {
					if (response) {
						videoLinks = videoLinks.concat(this.scrapeSearchResults(response.data));
					}
				});
				resolve(videoLinks);
			}).catch(err => {
			    reject(err);
			});
		});
		
	}

	scrapeSearchResults(pageBody) {
		const $ = cheerio.load(pageBody);
		const videos = [];
		const videoTiles = $('.yt-lockup-tile.yt-lockup-video');
		const resultlinks = videoTiles.find('.yt-lockup-title a');
		
		videoTiles.each((i, elem) => {
			const videoInfo = {};
			const duration = $(elem).find('.video-time').text();
			const durationSplit = duration.split(':');
			videoInfo.duration = parseInt(durationSplit[0]) * 60 + parseInt(durationSplit[1]);
			videoInfo.url = $(elem).find('.yt-lockup-title a').attr('href');
			videos.push(videoInfo);
		});

		return videos;
	}

	scrapeVideoInfo(pageBody) {
		const $ = cheerio.load(pageBody);
		const watchTitle = $('.watch-title').attr('title');
		let uploadDate = $('.watch-time-text').text();
		const viewCount = $('.watch-view-count').text().split(",").join(""); // 1,234 views
		const likes = $('.like-button-renderer-like-button-unclicked').text().split(",").join(""); // 1,234
		const dislikes = $('.like-button-renderer-dislike-button-unclicked').text().split(",").join(""); // 1,234
		const userInfo = $('.yt-user-info a');
		const creatorLink = userInfo.attr('href');
		const creatorName = userInfo.text();

		if (uploadDate.indexOf('Published on ') > -1) {
			uploadDate = uploadDate.substr('Published on '.length);
		}

		if (uploadDate.indexOf('Streamed live on ') > -1) {
			uploadDate = uploadDate.substr('Streamed live on '.length);
		}

		return {
			watchTitle, uploadDate, creatorLink, creatorName,
			viewCount: parseInt(viewCount),
			likes: parseInt(likes),
			dislikes: parseInt(dislikes),
			videoType: "youtube"
		};
	}

	getYoutubeVideoInfo(linkInfo) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				axios({
					url: `${this.youtubeBaseUrl}${linkInfo.url}`,
					method: 'GET',
					headers: {
						'User-Agent': this.getRandomArrayItem(this.userAgents),
						'Set-Cookie': this.cookieJar
					}
				}).then((response) => {
					const videoInfo = this.scrapeVideoInfo(response.data);
					videoInfo.url = linkInfo.url; 
					videoInfo.duration = linkInfo.duration; 
					// console.log("video info", videoInfo);
					resolve(videoInfo);
				}).catch((err) => {
					console.log(err);
					resolve([]);
				});
			}, 1000);
		});
	}

	readFileToArray(file) {
		return new Promise((resolve, reject) => {
			const instream = fs.createReadStream(file);
			const outstream = new stream;
			const rl = readline.createInterface(instream, outstream);

			const fileArray = [];

			rl.on('line', (line) => {
			  fileArray.push(line);
			});

			rl.on('close', () => {
			  resolve(fileArray);
			});
		})
	}

	getRandomArrayItem(array) {
		return array[Math.floor(Math.random() * array.length)];
	}
}

module.exports = VideoFetcher;
