import * as URL from 'url';
import ISummary from './isummary';

interface IPlugin {
	test: (url: URL.Url) => boolean;
	summary: (url: URL.Url) => Promise<ISummary>;
}

export default IPlugin;
