import * as URL from 'url';
import tracer from 'trace-redirect';
import ISummary from './isummary';
import IPlugin from './iplugin';
import general from './general';

const plugins: IPlugin[] = require('require-all')({
	dirname: __dirname + '/plugins'
});

export default async (url: string): Promise<ISummary> => {
	const actualUrl = await tracer(url);

	const _url = URL.parse(actualUrl, true);

	const match = Object.keys(plugins)
		.map(key => plugins[key])
		.filter(plugin => plugin.test(_url))[0] as IPlugin;

	const summary = match
		? await match.summary(_url)
		: await general(_url);

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
