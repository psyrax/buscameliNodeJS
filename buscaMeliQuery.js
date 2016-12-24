var config = require('./config.json');

const Promise = require('bluebird');
const mercadolibre = require('mercadolibre');
const meli = new mercadolibre.Meli(config.meliClient, config.meliSecret);


var meliAPI =
{
	search: function(){

		return new Promise( function(resolve, reject) {
			var queryParams = {
				"category" : "MLM1144",
				"q": "sega genesis",
				"since" : "today"
			}
			meli.get('sites/MLM/search', queryParams, function (err, res) {
				if(err){
					reject(err);
				} else {
					resolve(res);
				}
			});
		});
	}
}

module.exports = meliAPI;