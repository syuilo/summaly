import { name, version } from '../../package.json';
import * as URL from 'url';
import * as client from 'cheerio-httpcli';
import summary from '../summary';

client.set('headers', {
  'User-Agent': `${name}/${version}`
});
client.set('referer', false);
client.set('timeout', 10000);

export function test(url: URL.Url): boolean {
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
	url.hostname === 'www.amazon.au';
}

export async function summarize(url: URL.Url): Promise<summary> {
	const res = await client.fetch(url.href);
	const $ = res.$;

	const title = $('#title').text();

	const description =
		$('#productDescription').text() ||
		$('meta[name="description"]').attr('content');

	const thumbnail: string = $('#landingImage').attr('src');

	const playerUrl =
		$('meta[property="twitter:player"]').attr('content') ||
		$('meta[name="twitter:player"]').attr('content');

	const playerWidth = parseInt(
		$('meta[property="twitter:player:width"]').attr('content') ||
		$('meta[name="twitter:player:width"]').attr('content'));

	const playerHeight = parseInt(
		$('meta[property="twitter:player:height"]').attr('content') ||
		$('meta[name="twitter:player:height"]').attr('content'));

	return {
		title: title || null,
		icon: 'https://www.amazon.com/favicon.ico',
		description: description || null,
		thumbnail: thumbnail || null,
		player: {
			url: playerUrl || null,
			width: playerWidth || null,
			height: playerHeight || null
		},
		sitename: 'Amazon'
	};
}
