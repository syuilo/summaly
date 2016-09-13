import * as URL from 'url';
import * as request from 'request';
import Options from '../../options';

exports.test = (url: URL.Url) => {
	return url.hostname == 'soundcloud.com';
};

exports.compile = async (url: URL.Url, opts: Options) => {
	request({
		url: 'http://soundcloud.com/oembed',
		method: 'get',
		qs: {
			format: 'json',
			url: url.href
		}
	}, (err, response, body) => {
		if (err) {
			throw err;
		} else if (response.statusCode !== 200) {
			return null;
		} else {
			const parsed = JSON.parse(body);
			const html = parsed.html;
			return html.replace('height="400"', 'height="200"');
		}
	});
};
