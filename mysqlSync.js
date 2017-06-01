var config = require('./config.json');

const _ = require('underscore');
const mysql = require('mysql2');
const Promise = require('bluebird');

let connection = mysql.createConnection({
	host: config.mysql.host,
	user: config.mysql.username,
	password: config.mysql.password,
	database: config.mysql.database
});

var mysqlSync = {
	checkSent: function(data){
		return new Promise(function(resolve, reject){
			connection.query('SELECT meli_id FROM `sent_results`', function (err, results, fields) {
	  			if (err){
	  				reject(err);
	  			} else {
	  				var returnData = {
	  					meliResults : data.meliResults,
	  					results: results
	  				}
	  				resolve(returnData);
	  			}
			});
		})
	},
	saveSent: function(toSave){
		connection.query('INSERT INTO sent_results (meli_id, user_id) VALUES ? ', [toSave], function(err, rows){
			
		})
	}

}

module.exports = mysqlSync;