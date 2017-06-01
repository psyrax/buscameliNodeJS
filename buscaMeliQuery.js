var config = require('./config.json');

const Promise = require('bluebird');
const mercadolibre = require('mercadolibre');
const meli = new mercadolibre.Meli(config.meliClient, config.meliSecret);


var meliAPI =
{
	search: function(queryParams){

		return new Promise( function(resolve, reject) {
			meli.get('sites/MLM/search', queryParams, function (err, res) {
				if(err){
					reject(err);
				} else {
					console.log(res);
					resolve(res);
				}
			});
		});
	}
}

module.exports = meliAPI;