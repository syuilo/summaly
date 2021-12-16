import * as URL from 'url';
import clip from './utils/clip';
import cleanupTitle from './utils/cleanup-title';

import { decode as decodeHtml } from 'html-entities';

import { head, scpaping } from './utils/got';
import Summary from './summary';

export default async (url: URL.Url, lang: string = null): Promise<Summary> => {
	const res = await scpaping(url.href, { lang: lang || undefined });
	const $ = res.$;

	let title =
		$('meta[property="og:title"]').attr('content') ||
		$('meta[property="twitter:title"]').attr('content') ||
		$('title').text();

	if (title === undefined || title === null) {
		return null;
	}

	title = clip(decodeHtml(title), 100);

	let image =
		$('meta[property="og:image"]').attr('content') ||
		$('meta[property="twitter:image"]').attr('content') ||
		$('link[rel="image_src"]').attr('href') ||
		$('link[rel="apple-touch-icon"]').attr('href') ||
		$('link[rel="apple-touch-icon image_src"]').attr('href');

	image = image ? URL.resolve(url.href, image) : null;

	const playerUrl =
		$('meta[property="twitter:player"]').attr('content') ||
		$('meta[name="twitter:player"]').attr('content');

	const playerWidth = parseInt(
		$('meta[property="twitter:player:width"]').attr('content') ||
		$('meta[name="twitter:player:width"]').attr('content'));

	const playerHeight = parseInt(
		$('meta[property="twitter:player:height"]').attr('content') ||
		$('meta[name="twitter:player:height"]').attr('content'));

	let description =
		$('meta[property="og:description"]').attr('content') ||
		$('meta[property="twitter:description"]').attr('content') ||
		$('meta[name="description"]').attr('content');

	description = description
		? clip(decodeHtml(description), 300)
		: null;

	if (title === description) {
		description = null;
	}

	let siteName =
		$('meta[property="og:site_name"]').attr('content') ||
		$('meta[name="application-name"]').attr('content') ||
		url.hostname;

	siteName = siteName ? decodeHtml(siteName) : null;

	const favicon =
		$('link[rel="shortcut icon"]').attr('href') ||
		$('link[rel="icon"]').attr('href') ||
		'/favicon.ico';

	const sensitive = $('.tweet').attr('data-possibly-sensitive') === 'true'

	const find = async (path: string) => {
		const target = URL.resolve(url.href, path);
		const res = await head(target);
		return res.statusCode === 200 ? target : null;
	};

	// 相対的なURL (ex. test) を絶対的 (ex. /test) に変換
	const toAbsolute = (relativeURLString: string): string => {
		const relativeURL = URL.parse(relativeURLString);
		const isAbsolute = relativeURL.slashes || relativeURL.path[0] === '/';

		// 既に絶対的なら、即座に値を返却
		if (isAbsolute) {
			return relativeURLString;
		}

		// スラッシュを付けて返却
		return '/' + relativeURLString;
	};

	const icon = await find(favicon) ||
		// 相対指定を絶対指定に変換し再試行
		await find(toAbsolute(favicon)) ||
		null;

	// Clean up the title
	title = cleanupTitle(title, siteName);

	if (title === '') {
		title = siteName;
	}

	return {
		title: title || null,
		icon: icon || null,
		description: description || null,
		thumbnail: image || null,
		player: {
			url: playerUrl || null,
			width: playerWidth || null,
			height: playerHeight || null
		},
		sitename: siteName || null,
		sensitive,
	};
};
