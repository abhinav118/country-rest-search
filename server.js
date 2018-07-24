const data = require('./data.json');
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/name', (req, res) => {
	var json = [];

	if (req.query.data.length != 0) {
		data.forEach(function(el, index) {
			if (el.name.toLowerCase().indexOf(req.query.data.toLowerCase()) != -1) {
				if (req.query.city.length != 0) {
					if (el.country == req.query.city) {
						json.push(data[index]);
					}
				}
				else {
					json.push(data[index]);
				}
			}
		});
		Promise.all(json)
		.then((result) => res.send(json))
		.catch((err) => res.send(err));
	}
	else {
		res.send(json);
	}
});

app.get('/api/country', (req, res) => {
	var json = [];

	if (req.query.data.length != 0) {
		data.forEach(function(el, index) {
			if (el.country.toLowerCase().indexOf(req.query.data.toLowerCase()) != -1) {
				json.push(data[index]);
			}
		});
		Promise.all(json)
		.then((result) => res.send(json))
		.catch((err) => res.send(err));
	}
	else {
		res.send(json);
	}
});

app.listen(port, () => console.log(`Listening on port ${port}`));