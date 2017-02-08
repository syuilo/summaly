/**
 * summaly
 * https://github.com/syuilo/summaly
 */

import * as URL from 'url';
import requireAll = require('require-all');
import tracer from 'trace-redirect';
import Summary from './summary';
import IPlugin from './iplugin';
import general from './general';

// Load builtin plugins
const _builtinPlugins = requireAll({
	dirname: __dirname + '/plugins'
}) as { [key: string]: IPlugin };

const builtinPlugins = Object.keys(_builtinPlugins)
	.map(key => _builtinPlugins[key]);

type Options = {
	/**
	 * リダイレクトを追跡するか否か
	 */
	followRedirects?: boolean;

	/**
	 * Custom Plugins
	 */
	plugins?: IPlugin[];
};

type Result = Summary & {
	/**
	 * The actual url of that web page
	 */
	url: string;
};

/**
 * Summarize an web page
 * @param  {string}          url     URL of web page you want to summarize
 * @param  {Options?}        options The options
 * @return {Promise<Result>} Promised summary
 */
export default async (url: string, options?: Options): Promise<Result> => {
	const opts = Object.assign({
		followRedirects: true,
		plugins: null
	}, options) as Options;

	const plugins = builtinPlugins.concat(opts.plugins || []);

	// Follow redirects
	const actualUrl = opts.followRedirects ? await tracer(url) : url;

	const _url = URL.parse(actualUrl, true);

	// Find matching plugin
	const match = plugins.filter(plugin => plugin.test(_url))[0];

	// Get summary
	const summary = await (match ? match.summarize : general)(_url);

	return Object.assign(summary, {
		url: actualUrl
	});
};
