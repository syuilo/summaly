import * as URL from 'url';
import ISummary from './isummary';
import IPlugin from './iplugin';
import general from './general';

// Init babel
require('babel-core/register');
require('babel-polyfill');

const plugins: IPlugin[] = [
	require('./plugins/amazon'),
	require('./plugins/wikipedia')
];

export default async (url: string): Promise<ISummary> => {
	const _url = URL.parse(url, true);

	const plugin = plugins.filter(plugin => plugin.test(_url))[0];

	const summary = plugin
		? await plugin.summary(_url)
		: await general(_url);

	Object.keys(summary).forEach(k => {
		if ((<any>summary)[k]) {
			(<any>summary)[k] = (<any>summary)[k].trim();
			if ((<any>summary)[k] == '') {
				(<any>summary)[k] = null;
			}
		}
	});

	return summary;
}
