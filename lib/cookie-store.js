const puppeteer = require('puppeteer');
const _cookie = require('cookie');
const fs = require('fs');

class CookieStore {
	constructor() {
		this.cookies = [];
		this.cookieJar = {};
	}

	async generateCookies() {
		const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
	    const page = await browser.newPage();
	    await page.goto('https://youtube.com', {waitUntil : 'networkidle2' });

		// Here we can get all of the cookies
		const cookies = await page._client.send('Network.getAllCookies');
		this.cookies = cookies.cookies;
		this.saveCookieJSON(cookies);
	}

	saveCookieJSON(cookieJSON) {
		return new Promise((resolve, reject) => {
			fs.writeFile('../data/cookies.json', JSON.stringify(cookieJSON), 'utf8', (err) => {
				if (err) throw err;
				resolve(true);
			});
		});
	}

	fetchCookieJSON() {
		return new Promise((resolve, reject) => {
			fs.readFile('../data/cookies.json', (err, data) => {
			    if (err) throw err;
			    this.cookies = JSON.parse(data).cookies;
			    resolve(this.cookies);
			});
		})
	}

	async buildCookieJar() {
		if (this.cookies.length == 0) {
			this.cookies = await this.fetchCookieJSON();
		}
		this.cookieJar = this.cookies.map((cookie) => {
			// console.log(new Date(parseInt(cookie.expires)*1000).toUTCString());
			return _cookie.serialize(cookie.name, cookie.value, {
				domain: cookie.domain,
				path: cookie.path
			});
		}).join(',');
		
	}

	getCookieJar() {
		return this.cookieJar;
	}
}

module.exports = CookieStore;
