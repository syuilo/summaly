import * as URL from 'url';
const pug = require('pug');
import Options from '../../options';

exports.test = (url: URL.Url) =>
	url.hostname == 'youtube.com' ||
	url.hostname == 'www.youtube.com' ||
	url.hostname == 'youtu.be'
;

exports.compile = async (url: URL.Url, opts: Options) => {
	let videoId: string;

	switch (url.hostname) {
		case 'www.youtube.com':
		case 'youtube.com':
			videoId = url.query.v;
			break;
		case 'youtu.be':
			videoId = url.pathname;
			break;
	}

	return pug.renderFile(`${__dirname}/view.pug`, {
		videoId
	});
};
