import * as URL from 'url';
import * as request from 'request';
import * as debug from 'debug';

const log = debug('summaly:plugins:wikipedia');

exports.test = (url: URL.Url) =>
	/\.wikipedia\.org$/.test(url.hostname);

exports.summary = (url: URL.Url) => new Promise((res, rej) => {
	const lang = url.host.split('.')[0];
	const title = url.pathname.split('/')[2];
	const endpoint = `https://${lang}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${encodeURIComponent(title)}`;

	log(`lang is ${lang}`);
	log(`title is ${title}`);
	log(`endpoint is ${endpoint}`);

	request(endpoint, (err, _, body) => {
		log(body);
		body = JSON.parse(body);
		const info = body.query.pages[Object.keys(body.query.pages)[0]];
		res({
			title: info.title,
			icon: 'https://wikipedia.org/static/favicon/wikipedia.ico',
			description: info.extract,
			thumbnail: `https://wikipedia.org/static/images/project-logos/${lang}wiki.png`,
			sitename: 'Wikipedia'
		});
	});
});
