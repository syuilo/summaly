import * as URL from 'url';

const client = require('cheerio-httpcli');
client.referer = false;
client.timeout = 10000;

export function test (url: URL.Url) {
	return url.hostname === 'www.amazon.com' ||
	url.hostname === 'www.amazon.co.jp' ||
	url.hostname === 'www.amazon.ca' ||
	url.hostname === 'www.amazon.com.br' ||
	url.hostname === 'www.amazon.com.mx' ||
	url.hostname === 'www.amazon.co.uk' ||
	url.hostname === 'www.amazon.de' ||
	url.hostname === 'www.amazon.fr' ||
	url.hostname === 'www.amazon.it' ||
	url.hostname === 'www.amazon.es' ||
	url.hostname === 'www.amazon.nl' ||
	url.hostname === 'www.amazon.cn' ||
	url.hostname === 'www.amazon.in' ||
	url.hostname === 'www.amazon.au'
};

export async function summary (url: URL.Url) {
	const res = await client.fetch(url.href);
	const $: any = res.$;

	const title: string = $('#title').text();

	const description: string =
		$('#productDescription').text() ||
		$('meta[name="description"]').attr('content');

	const thumbnail: string = $('#landingImage').attr('src');

	return {
		title: title,
		icon: 'https://www.amazon.com/favicon.ico',
		description: description,
		thumbnail: thumbnail,
		sitename: 'Amazon'
	};
};
