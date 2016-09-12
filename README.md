webcard
=======

Generate an html of any web page's summary.

Installation
------------
`$ npm install webcard`

Usage
-----
`(url: string, options: Options) => Promise<string>`

### Options
| Property  | Type     | Description                               | Default |
| :-------- | :------- | :---------------------------------------- | :------ |
| **proxy** | *string* | URL of proxy that wrap non-https contents | `null`  |

### Example
``` javascript
import webcard from 'webcard';

const html = await webcard('http://example.com', {
  proxy: 'https://your.proxy.com'
});
```

License
-------
[MIT](LICENSE)
