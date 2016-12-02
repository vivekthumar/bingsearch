

var DBManager = require('../database/db_manager'),
	collectionName = 'data',
	//http = require('http'),                                                
    //Stream = require('stream').Transform,                                  
    fs = require('fs'),
    q = require('q'),
    request = require('request'),
	cheerio = require('cheerio'),
	connectivity = require('connectivity'),
    //Jimp = require("jimp"),
    config = require('../config/config.js');


function getData(query){
	var arr = [];
	var deffered = q.defer();
	request('https://www.bing.com/search?q='+query, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(body);
			var $results =  $('#b_results');
			var $algo = $results.find('.b_algo')
			var $h = $algo.find('h2');
			var $caption = $algo.find('.b_caption').find('.b_attribution').find('cite')
  			var $meta = $algo.find('.b_caption').find('p');
  			for(var i = 0; i < $algo.length; i++){
  				var obj = {};
		  		var $link = $h.find('a').eq(i).attr('href');
		  		//console.log('-----------------------------------')
		  		var $text = $h.find('a').eq(i).text();
		  		//console.log($link,'   ',$text)
		  		var $secondLink = $caption.eq(i).text();
		  		//console.log($secondLink)
		  		var $metaData = $meta.eq(i).text();
		  		//console.log($metaData)
		  		obj.firstLink = $link
		  		obj.linkText = $text
		  		obj.secondLink = $secondLink
		  		obj.metaData = $metaData
		  		arr.push(obj)
		  		if(i == $algo.length-1){
		  			deffered.resolve(arr)
		  		}
		  	}
		}else{
			deffered.reject([]);
		}
	});
	return deffered.promise;
}

exports.searchFromBing = function(req,res){
	var query = (req.body.query).toLowerCase().trim();
	opt = {key : query}
	connectivity(function (online) {
		if (online) {
			getData(query).then(function(data){
				DBManager.FindIntoDB(collectionName,opt, function(results){
					if(results.length && results.length > 0){
						res.send({status : 'success', data: data})
					}else{
						DBManager.insertIntoDB(collectionName,{key : query ,data : data},function(results){
							if(results){
								res.send({status : 'success', data: data})
							}else{
								res.send({status : 'Fail'})
							}
						})
					}
				})
			},function(err){
				res.send({status : 'Fail'})
			});
		} else {
			DBManager.FindIntoDB(collectionName,opt, function(results){
				if(results.length && results.length > 0){
					res.send({status : 'success', data: results[0].data})
				}else{
					res.send({status : 'Fail'})
				}
			});
			//res.send('sorry, not connected!')
		}
	});
	/*DBManager.insertIntoDB(collectionName,{r : 'test'},function(results){
		console.log(results)
	})*/
	/*var imageName = (req.body.imageName).trim(),
		updateFlag = req.body.updateFlag,
		imageArr = [];

	var opt = {image : imageName}
	DBManager.FindIntoDB(collectionName, opt, function(results){
		if(results.length && results.length > 0 && !updateFlag){
			var obj = {
                status : false
            }
            res.send(JSON.stringify(obj,null,4));

		}else{
			
			var page = 1;
			if(results && results.length > 0 && results[0] && results[0].data.length > 0){
				page =  Math.ceil((results[0].data.length / 10) + results[0].data.length)	
				imageArr = imageArr.concat(results[0].data)
			}
			client.search(imageName,{ page: page }).then(function (images) {
     			
     			function sync(){
     				if(i < images.length){ 
     					download(images[i]).then(function(imageObj){
     						imageArr.push(imageObj.path)
     						compress(imageObj.path).then(function(){
     							i++;
     							sync();
     						},function(err){
     							i++;
     							sync();
     						});
     					},function(err){
     						i++;
     						sync();
     					});
     				}else{
 						var data = {image : imageName,data : imageArr}
 						DBManager.UpdateIntoDB(collectionName, {image : imageName}, data, function(insertResult){
 							var obj = {
			                	status : true
				            }
				            res.send(JSON.stringify(obj,null,4));
 						});
     				}
     			};
        		var i = 0;
        		sync();
    		});

			
		}	
	});*/
	
};




