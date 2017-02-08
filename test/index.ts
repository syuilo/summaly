/**
 * Tests!
 */

import * as chai from 'chai';
import * as express from 'express';

import summaly from '../';

Error.stackTraceLimit = Infinity;

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Display detail of unhandled promise rejection
process.on('unhandledRejection', console.dir);

const should = chai.should();

describe('OGP', () => {
	it('title', () => {
		const server = express();
		server.use((req, res) => {
			res.sendFile('./htmls/og-title.html');
		});
		server.listen(0, async () => {
			const summary = await summaly('localhost:0');
			should.equal(summary.title, 'KISS principle');
		});
	});
});
