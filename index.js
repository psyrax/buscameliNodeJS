const meli = require('./buscaMeliQuery.js');
const mysqlSync = require('./mysqlSync.js');
const mailSender = require('./mailSender.js');
const _ = require('underscore');


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
		var willSendIds;
		meli.search(queryParams)
		.then(function(data) {
		   var checkData = {
		   		meliResults : data.results,
		   		userId : 1
		   };
		   return mysqlSync.checkSent(checkData);
		})
		.then(function(data){
			
			var sentIds = _.pluck(data.results, 'meli_id');
			var toCheckIds = _.pluck(data.meliResults, 'id');
			willSendIds = _.difference(toCheckIds, sentIds);
			var notSent = _.filter(data.meliResults, function(result){
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