const config = require('./config.json');
const mailgun = require('mailgun-js')({apiKey: config.mailgun.api_key, domain : config.mailgun.domain});
const Promise = require('bluebird');
const _ = require('underscore');
const moment = require('moment');
const fs = require('fs');
const Handlebars = require('handlebars');
var emailTemplateQuery = fs.readFileSync('./templates/emails/query.handlebars', 'utf8');

moment.locale('es');
  
var mailSender = {
	htmlParser: function(data){
		var tempalteData = {
			results: data.results,
			username: 'psyrax',
			searchQuery: data.query
		}
		var template = Handlebars.compile(emailTemplateQuery);
		var parsedHtml = template(tempalteData);
		return new Promise(function(resolve, reject){
			if( data.results.length < 1 ){
				reject('No data to send');
			}
			resolve(parsedHtml);
		})
	},
	sendMail: function(mailBody){
		var data = {
		  from: 'Buscameli <bot@buscameli.com>',
		  to: 'psyrax@opiumgarden.org',
		  subject: 'Buscameli - Actualización para Genesis ' + moment().format('L') + ' ' + moment().format('LT'),
		  html: mailBody
		};
		return new Promise(function(resolve, reject) {
			mailgun.messages().send(data, function (error, body) {
		  		if(error){
		  			reject(error);
		  		} else {
		  			resolve(body);
		  		};
			})
		});
	}
}
module.exports = mailSender;