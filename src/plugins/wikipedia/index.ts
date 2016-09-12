import * as URL from 'url';
const pug = require('pug');
import Options from '../../options';

const client = require('cheerio-httpcli');
client.referer = false;
client.timeout = 10000;

exports.test = (url: URL.Url) => {
	return /\.wikipedia\.org$/.test(url.hostname);
};

exports.compile = async (url: URL.Url, opts: Options) => {
	const res = await client.fetch(url.href);
	const $: any = res.$;

	const lang = url.hostname.substr(0, url.hostname.indexOf('.'));
	const isDesktop = !/\.m\.wikipedia\.org$/.test(url.hostname);
	const text: string = isDesktop
		? $('#mw-content-text > p:first-of-type').text()
		: $('#bodyContent > div:first-of-type > p:first-of-type').text();

	return pug.renderFile(`${__dirname}/../../general/summary.pug`, {
		url: url,
		title: decodeURI(url.pathname.split('/')[2]),
		icon: 'https://wikipedia.org/static/favicon/wikipedia.ico',
		description: text,
		image: `https://wikipedia.org/static/images/project-logos/${lang}wiki.png`,
		siteName: 'Wikipedia'
	});
};
