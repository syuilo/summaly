const escapeRegExp = require('escape-regexp');

export default function(title: string, siteName?: string): string {
	title = title.trim();

	if (siteName) {
		siteName = siteName.trim();

		const x = escapeRegExp(siteName);

		const patterns = [
			`^(.+?)\\s?[\\-\\|:・]\\s?${x}$`
		];

		for (let i = 0; i < patterns.length; i++) {
			const pattern = new RegExp(patterns[i]);
			const [, match] = pattern.exec(title) || [null, null];
			if (match) return match;
		}
	}

	return title;
}
