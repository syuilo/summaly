const escapeRegExp = require('escape-regexp');

export default function(title: string, siteName?: string): string {
	title = title.trim();

	if (siteName) {
		siteName = siteName.trim();

		const x = escapeRegExp(siteName);

		const patterns = [
			`^(.+?)\s?[\-\|:・]\s?${x}$`
		].map(p => new RegExp(p));

		for (let i = 0; i < patterns.length; i++) {
			const [, match] = patterns[i].exec(title);
			if (match) return match;
		}
	}

	return title;
}
