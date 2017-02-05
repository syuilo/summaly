import * as URL from 'url';
import Summary from './summary';

interface IPlugin {
	test: (url: URL.Url) => boolean;
	summary: (url: URL.Url) => Promise<Summary>;
}

export default IPlugin;
