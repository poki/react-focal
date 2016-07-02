import express from 'express';

const app = express();

app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/index.html`);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.info(`Listening on port ${port}`));
