import * as URL from 'url';
import IPlugin from './iplugin';
import Options from './options';
import general from './general';

// Init babel
require('babel-core/register');
require('babel-polyfill');

const plugins: IPlugin[] = [
	require('./plugins/wikipedia')
];

export default async (url: string, opts: Options): Promise<string> => {
	const _url = URL.parse(url, true);

	const plugin = plugins.filter(plugin => plugin.test(_url))[0];

	if (plugin) {
		return await plugin.compile(_url, opts);
	} else {
		return await general(_url, opts);
	}
}
