import * as URL from 'url';
import Options from './options';

interface IPlugin {
	test: (url: URL.Url) => boolean;
	compile: (url: URL.Url, opts: Options) => Promise<string>;
}

export default IPlugin;