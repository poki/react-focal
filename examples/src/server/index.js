import express from 'express';
import serveStatic from 'serve-static';

const app = express();

app.use(serveStatic(`${__dirname}/../public`));

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.info(`Listening on port ${port}`));
