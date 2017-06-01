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
	meli.search()
	.then(function(data) {
	   meliResults = data.results;
	   return mysqlSync.checkSent();
	})
	.then(function(data){
		sentIds = _.pluck(data, 'meli_id');
		toCheckIds = _.pluck(meliResults, 'id');
		willSendIds = _.difference(toCheckIds, sentIds);
		notSent = _.filter(meliResults, function(result){
			if ( willSendIds.indexOf(result.id) > -1 ){
				return result;
			}
		});
		return mailSender.htmlParser(notSent);
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
	})
};


mailLoop();
setInterval(function() {
	mailLoop();
}, 3600000);