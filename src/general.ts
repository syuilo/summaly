import * as URL from 'url';
import * as request from 'request';

const escapeRegExp = require('escape-regexp');

const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const client = require('cheerio-httpcli');
client.referer = false;
client.timeout = 10000;

import ISummary from './isummary';

export default async (url: URL.Url): Promise<ISummary> => {
	const res = await client.fetch(url.href);

	if (res.error) {
		throw 'something happened';
	}

	const contentType: string = res.response.headers['content-type'];

	// HTMLじゃなかった場合は中止
	if (contentType.indexOf('text/html') === -1) {
		return null;
	}

	const $: any = res.$;

	let title =
		$('meta[property="og:title"]').attr('content') ||
		$('meta[property="twitter:title"]').attr('content') ||
		$('title').text();

	if (title == null) {
		return null;
	}

	title = clip(entities.decode(title), 100);

	const lang: string = $('html').attr('lang');

	let image =
		$('meta[property="og:image"]').attr('content') ||
		$('meta[property="twitter:image"]').attr('content') ||
		$('link[rel="image_src"]').attr('href') ||
		$('link[rel="apple-touch-icon"]').attr('href') ||
		$('link[rel="apple-touch-icon image_src"]').attr('href');

	image = image ? URL.resolve(url.href, image) : null;

	let description =
		$('meta[property="og:description"]').attr('content') ||
		$('meta[property="twitter:description"]').attr('content') ||
		$('meta[name="description"]').attr('content');

	description = description
		? clip(entities.decode(description), 300)
		: null;

	if (title === description) {
		description = null;
	}

	let siteName =
		$('meta[property="og:site_name"]').attr('content') ||
		$('meta[name="application-name"]').attr('content') ||
		url.hostname;

	siteName = siteName ? entities.decode(siteName) : null;

	let icon =
		$('link[rel="shortcut icon"]').attr('href') ||
		$('link[rel="icon"]').attr('href') ||
		'/favicon.ico';

	icon = icon ? URL.resolve(url.href, icon) : null;

	title = title.replace(new RegExp(`${escapeRegExp(siteName)}$`), '').trim();
	title = title.replace(/[\-—\|:]$/, '').trim();

	if (title == '') {
		title = siteName;
	}

	return {
		title: title,
		icon: icon,
		description: description,
		thumbnail: image,
		sitename: siteName
	};
}

function promisifyRequest(request: any): (x: any) => Promise<any> {
	return (x: any) => {
		return new Promise<any>((resolve) => {
			request(x, (a: any, b: any, c: any) => {
				resolve(c);
			});
		});
	};
}

function nullOrEmpty(val: string): boolean {
	if (val === undefined) {
		return true;
	} else if (val === null) {
		return true;
	} else if (val.trim() === '') {
		return true;
	} else {
		return false;
	}
}

function clip(s: string, max: number): string {
	if (nullOrEmpty(s)) {
		return s;
	}

	s = s.trim();

	if (s.length > max) {
		return s.substr(0, max) + '...';
	} else {
		return s;
	}
}
