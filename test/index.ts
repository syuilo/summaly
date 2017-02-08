/**
 * Tests!
 */

import http from 'http';
import chai from 'chai';
import summaly from '../';

Error.stackTraceLimit = Infinity;

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

// Display detail of unhandled promise rejection
process.on('unhandledRejection', console.dir);

const should = chai.should();

it('well-defined meta site', async () => {
	should.equal(await summaly('localhost:0'), 'hoge');
});
