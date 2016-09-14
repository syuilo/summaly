summaly
=======

[![][npm-badge]][npm-link]

Get any web page's summary.

Installation
------------
`$ npm install summaly`

Usage
-----
```
(url: string) => Promise<{
	title: string;
	icon: string;
	description: string;
	thumbnail: string;
	sitename: string;
}>
```

### Example
``` javascript
import summaly from 'summaly';

const info = await summaly('http://example.com');
```

License
-------
[MIT](LICENSE)

[npm-link]:  https://www.npmjs.com/package/summaly
[npm-badge]: https://img.shields.io/npm/v/summaly.svg?style=flat-square
