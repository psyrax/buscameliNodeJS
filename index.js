const meli = require('./buscaMeliQuery.js');
const mysqlSync = require('./mysqlSync.js');
const mailSender = require('./mailSender.js');
const _ = require('underscore');

var meliResults;
var sentIds;
var toCheckIds;
var willSendIds;
var notSent;

function mailLoop(){
	var searchQueries = [
		{
			"category" : "MLM1144",
			"q": "sega genesis",
			"since" : "today"
		},
		{
			"category" : "MLM1144",
			"q": "dreamcast",
			"since" : "today"
		}
	];
	searchQueries.forEach(function(queryParams){
		meli.search(queryParams)
		.then(function(data) {
		   meliResults = data.results;
		   var checkData = {
		   		meliResults : data.results,
		   		userId : 1
		   };
		   return mysqlSync.checkSent(data);
		})
		.then(function(data){
			sentIds = _.pluck(data, 'meli_id');
			toCheckIds = _.pluck(data.meliResults, 'id');
			willSendIds = _.difference(toCheckIds, sentIds);
			notSent = _.filter(data.meliResults, function(result){
				if ( willSendIds.indexOf(result.id) > -1 ){
					return result;
				}
			});
			var data = {
				results : notSent,
				query 	: queryParams.q
			}
			return mailSender.htmlParser(data);
		})
		.then(function(data){
			return mailSender.sendMail(data);
		})
		.then(function(data){
			var toSync = [];
			willSendIds.forEach(function(id){
				toSync.push([id, 1]);
			})
			return mysqlSync.saveSent(toSync);
		});
	});
};


mailLoop();
setInterval(function() {
	mailLoop();
}, 3600000);