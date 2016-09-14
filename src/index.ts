import * as URL from 'url';
import ISummary from './isummary';
import IPlugin from './iplugin';
import general from './general';

// Init babel
require('babel-core/register');
require('babel-polyfill');

const plugins: IPlugin[] = [
	require('./plugins/wikipedia')
];

export default async (url: string): Promise<ISummary> => {
	const _url = URL.parse(url, true);

	const plugin = plugins.filter(plugin => plugin.test(_url))[0];

	if (plugin) {
		return await plugin.summary(_url);
	} else {
		return await general(_url);
	}
}
