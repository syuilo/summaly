import * as URL from 'url';
import ISummary from '../isummary';

const client = require('cheerio-httpcli');
client.referer = false;
client.timeout = 10000;

exports.test = (url: URL.Url) =>
	/\.wikipedia\.org$/.test(url.hostname);

exports.summary = async (url: URL.Url) => {
	const res = await client.fetch(url.href);
	const $: any = res.$;

	const lang = url.hostname.substr(0, url.hostname.indexOf('.'));
	const isDesktop = !/\.m\.wikipedia\.org$/.test(url.hostname);
	const text: string = isDesktop
		? $('#mw-content-text > p:first-of-type').text()
		: $('#mw-content-text > div:first-of-type > p:first-of-type').text();

	return {
		title: decodeURI(url.pathname.split('/')[2]),
		icon: 'https://wikipedia.org/static/favicon/wikipedia.ico',
		description: text,
		thumbnail: `https://wikipedia.org/static/images/project-logos/${lang}wiki.png`,
		sitename: 'Wikipedia'
	};
};
