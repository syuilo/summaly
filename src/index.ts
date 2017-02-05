/**
 * summaly
 * https://github.com/syuilo/summaly
 */

import * as URL from 'url';
import requireAll from 'require-all';
import tracer from 'trace-redirect';
import ISummary from './isummary';
import IPlugin from './iplugin';
import general from './general';

// Load builtin plugins
const builtinPlugins = requireAll({
	dirname: __dirname + '/plugins'
}) as IPlugin[];

export interface IOptions {
	/**
	 * リダイレクトを追跡するか否か
	 */
	followRedirects?: boolean;

	/**
	 * Custom Plugins
	 */
	plugins?: IPlugin[];
}

type Result = ISummary & {
	url: string;
};

/**
 * Summary an web page
 * @param  {string}          url     URL of web page you want to summary
 * @param  {IOptions}        options The options
 * @return {Promise<Result>} Promised summary
 */
export default async (url: string, options: IOptions): Promise<Result> => {
	const opts = Object.assign({
		followRedirects: true,
		plugins: null
	}, options);

	const plugins = Object.keys(builtinPlugins)
		.map(key => builtinPlugins[key])
		.concat(opts.plugins || []);

	// Follow redirects
	const actualUrl = opts.followRedirects ? await tracer(url) : url;

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

	return Object.assign(summary, {
		url: actualUrl
	});
};
