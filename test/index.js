/**
 * Tests!
 */

'use strict';

/* dependencies below */

const assert = require('assert');
const express = require('express');
const summaly = require('../').default;

/* settings below */

Error.stackTraceLimit = Infinity;

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.SUMMALY_ALLOW_PRIVATE_IP = 'true';

// Display detail of unhandled promise rejection
process.on('unhandledRejection', console.dir);

const port = 3000;
const host = `http://localhost:${port}`;

let server;

afterEach(() => {
	server.close();
});

/* tests below */

it('faviconがHTML上で指定されていないが、ルートに存在する場合、正しく設定される', done => {
	const app = express();
	app.get('/', (req, res) => {
		res.sendFile(__dirname + '/htmls/no-favicon.html');
	});
	app.get('/favicon.ico', (_, res) => res.sendStatus(200));
	server = app.listen(port, async () => {
		const summary = await summaly(host);
		assert.equal(summary.icon, `${host}/favicon.ico`);
		done();
	});
});

it('faviconがHTML上で指定されていなくて、ルートにも存在しなかった場合 null になる', done => {
	const app = express();
	app.get('/', (req, res) => {
		res.sendFile(__dirname + '/htmls/no-favicon.html');
	});
	server = app.listen(port, async () => {
		const summary = await summaly(host);
		assert.equal(summary.icon, null);
		done();
	});
});

it('titleがcleanupされる', done => {
	const app = express();
	app.get('/', (req, res) => {
		res.sendFile(__dirname + '/htmls/dirty-title.html');
	});
	server = app.listen(port, async () => {
		const summary = await summaly(host);
		assert.equal(summary.title, 'Strawberry Pasta');
		done();
	});
});

describe('Private IP blocking', () => {
	before(() => {
		process.env.SUMMALY_ALLOW_PRIVATE_IP = 'false';
	});

	it('private ipなサーバーの情報を取得できない', done => {
		const app = express();
		app.get('/', (req, res) => {
			res.sendFile(__dirname + '/htmls/og-title.html');
		});
		server = app.listen(port, async () => {
			await assert.rejects(async () => await summaly(host));
			done();
		});
	});

	after(() => {
		process.env.SUMMALY_ALLOW_PRIVATE_IP = 'true';
	});
});

describe('OGP', () => {
	it('title', done => {
		const app = express();
		app.get('/', (req, res) => {
			res.sendFile(__dirname + '/htmls/og-title.html');
		});
		server = app.listen(port, async () => {
			const summary = await summaly(host);
			assert.equal(summary.title, 'Strawberry Pasta');
			done();
		});
	});

	it('description', done => {
		const app = express();
		app.get('/', (req, res) => {
			res.sendFile(__dirname + '/htmls/og-description.html');
		});
		server = app.listen(port, async () => {
			const summary = await summaly(host);
			assert.equal(summary.description, 'Strawberry Pasta');
			done();
		});
	});

	it('site_name', done => {
		const app = express();
		app.get('/', (req, res) => {
			res.sendFile(__dirname + '/htmls/og-site_name.html');
		});
		server = app.listen(port, async () => {
			const summary = await summaly(host);
			assert.equal(summary.sitename, 'Strawberry Pasta');
			done();
		});
	});

	it('thumbnail', done => {
		const app = express();
		app.get('/', (req, res) => {
			res.sendFile(__dirname + '/htmls/og-image.html');
		});
		server = app.listen(port, async () => {
			const summary = await summaly(host);
			assert.equal(summary.thumbnail, 'https://himasaku.net/himasaku.png');
			done();
		});
	});
});

describe('TwitterCard', () => {
	it('title', done => {
		const app = express();
		app.get('/', (req, res) => {
			res.sendFile(__dirname + '/htmls/twitter-title.html');
		});
		server = app.listen(port, async () => {
			const summary = await summaly(host);
			assert.equal(summary.title, 'Strawberry Pasta');
			done();
		});
	});

	it('description', done => {
		const app = express();
		app.get('/', (req, res) => {
			res.sendFile(__dirname + '/htmls/twitter-description.html');
		});
		server = app.listen(port, async () => {
			const summary = await summaly(host);
			assert.equal(summary.description, 'Strawberry Pasta');
			done();
		});
	});

	it('thumbnail', done => {
		const app = express();
		app.get('/', (req, res) => {
			res.sendFile(__dirname + '/htmls/twitter-image.html');
		});
		server = app.listen(port, async () => {
			const summary = await summaly(host);
			assert.equal(summary.thumbnail, 'https://himasaku.net/himasaku.png');
			done();
		});
	});

	it('Player detection - PeerTube:video => video', done => {
		const app = express();
		app.get('/', (req, res) => {
			res.sendFile(__dirname + '/htmls/player-peertube-video.html');
		});
		server = app.listen(port, async () => {
			const summary = await summaly(host);
			assert.equal(summary.player.url, 'https://example.com/embedurl');
			done();
		});
	});

	it('Player detection - Pleroma:video => video', done => {
		const app = express();
		app.get('/', (req, res) => {
			res.sendFile(__dirname + '/htmls/player-pleroma-video.html');
		});
		server = app.listen(port, async () => {
			const summary = await summaly(host);
			assert.equal(summary.player.url, 'https://example.com/embedurl');
			done();
		});
	});

	it('Player detection - Pleroma:image => image', done => {
		const app = express();
		app.get('/', (req, res) => {
			res.sendFile(__dirname + '/htmls/player-pleroma-image.html');
		});
		server = app.listen(port, async () => {
			const summary = await summaly(host);
			assert.equal(summary.player.url, null);
			done();
		});
	});

});
