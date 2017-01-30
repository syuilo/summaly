/**
 * summaly
 * https://github.com/syuilo/summaly
 */

import * as URL from 'url';
import tracer from 'trace-redirect';
import ISummary from './isummary';
import IPlugin from './iplugin';
import general from './general';

// Load plugins
const plugins: IPlugin[] = require('require-all')({
	dirname: __dirname + '/plugins'
});

/**
 * Summary an web page
 * @param  {string}            url URL of web page you want to summary
 * @return {Promise<ISummary>}     Promised summary
 */
export default async (url: string): Promise<ISummary> => {
	// Follow redirects
	const actualUrl = await tracer(url);

	const _url = URL.parse(actualUrl, true);

	// Find matching plugin
	const match = Object.keys(plugins)
		.map(key => plugins[key])
		.filter(plugin => plugin.test(_url))[0] as IPlugin;

	// Get summary
	const summary = match
		? await match.summary(_url)
		: await general(_url);

	// Replace '' to null
	Object.keys(summary).forEach(k => {
		if (summary[k]) {
			summary[k] = summary[k].trim();
			if (summary[k] === '') {
				summary[k] = null;
			}
		}
	});

	return summary;
};
