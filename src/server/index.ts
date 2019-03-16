import * as http from 'http';
import * as Koa from 'koa';
import summaly from '../';

const app = new Koa();

app.use(async ctx => {
	if (!ctx.query.url) {
		ctx.status = 400;
		return;
	}

	try {
		const summary = await summaly(ctx.query.url, {
			followRedirects: false
		});

		ctx.body = summary;
	} catch (e) {
		ctx.status = 500;
	}
});

const server = http.createServer(app.callback());

server.listen(80);
