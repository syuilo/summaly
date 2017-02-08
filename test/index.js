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

// Display detail of unhandled promise rejection
process.on('unhandledRejection', console.dir);

/* tests below */

describe('OGP', () => {
	it('title', done => {
		const app = express();
		app.use((req, res) => {
			res.sendFile(__dirname + '/htmls/og-title.html');
		});
		const server = app.listen(80, async () => {
			const summary = await summaly('http://localhost');
			assert.equal(summary.title, 'Strawberry Pasta');
			server.close();
			done();
		});
	});

	it('description', done => {
		const app = express();
		app.use((req, res) => {
			res.sendFile(__dirname + '/htmls/og-description.html');
		});
		const server = app.listen(80, async () => {
			const summary = await summaly('http://localhost');
			assert.equal(summary.description, 'Strawberry Pasta');
			server.close();
			done();
		});
	});
});
