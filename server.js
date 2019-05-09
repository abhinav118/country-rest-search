const data = require('./data.json');
const express = require('express');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

const config = require('./config.json');

const mongoose = require('mongoose');

const port = process.env.PORT || 5000;

//connect mongodb
mongoose.connect(`mongodb://${config.db.user}:${config.db.password}@${config.server}:${config.port}/${config.db.name}`);
mongoose.Promise = global.Promise;

//query to getting name restaurant (table from db ,name restaurant, callback)
function find (name, query, cb) {
	mongoose.connection.db.collection(name, function (err, collection) {
		collection.find(query).toArray(cb);
	});
}
//query to getting city (table from db ,name city, callback)
function finds (name, query, cb) {
	mongoose.connection.db.collection(name, function (err, collection) {
		collection.aggregate(query).toArray(cb);
	});
}

// function findDistinct (name, query, cb) {
// 	mongoose.connection.db.collection(name, function (err, collection) {
// 		collection.distinct('restaurant_info.city',query).toArray(cb);
// 	});
// }

//address to getting from clients autocomplete restourant
app.get('/api/name', (req, res) => {
	if (req.query.city.length != 0) {
		var s = req.query.city.split(',');
		find('allmenus', { 'restaurant_info.name' :  new RegExp(req.query.data, "i"), 'restaurant_info.city' :  new RegExp(s[0]) }, function (err, docs) {
			res.send(docs);
		});
	}
	else {
		find('allmenus', { 'restaurant_info.name' :  new RegExp(req.query.data, "i") }, function (err, docs) {
			res.send(docs);
		});
	}
});

//address to getting from clients autocomplete restourant
app.get('/api/country', (req, res) => {
	finds('allmenus', [  {$match: { 'restaurant_info.city': new RegExp(req.query.data, "i") }},{ $group: { 
			_id: '$restaurant_info.city', 
			restaurant_info: { $first: '$restaurant_info' } 
		}
     	}], function (err, docs) {
			res.send(docs);
		});
	// mongoose.connection.db.collections('allmenus', function(err, collections){
	// 	collections[0].distinct('restaurant_info.city', { 'restaurant_info.city' :  /sa/i }, function( err, results ){
	// 	    res.send(results);
	// 	});
	// });
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));

