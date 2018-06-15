var request = require('request'),
	rimraf = require('rimraf'),
	fs = require('fs');
	
var host = "https://api.vk.com/method/wall.get",
	publics = [-29534144],
	folder = './img',
	props = {
		access_token: "123",
		count: 10,
		v: 5.78
	},
	count = 0;

rimraf(folder, function () { 

	fs.mkdirSync(folder);
	try{
		publics.forEach(function(public_id){
		props.owner_id = public_id;
		request({url:host, qs:props}, function(err, response, body) {
			var body = JSON.parse(response.body),
				photos = [],
				post_at = body.response.items
					.map(function(item){ 
						return item.attachments.filter(function(at){ return at.type === 'photo'});
					})
				post_at.forEach(function(item){ 
					item.forEach(function(at){
						if(at.type){
							var big = at.photo.sizes.filter(function(photo){ return photo.width > 900 });
							if(!big[0]){
								big = at.photo.sizes.filter(function(photo){ return photo.width > 400 })
							}
							if(big[0]){
								photos.push(big[0].url);
							}
						}
					})
				})
				console.log(photos);
				
				photos.forEach(function(ph){
					request(ph).pipe(fs.createWriteStream(folder +'/' + count + '.jpg')).on('close', function(){});
					count++;
				})
			})
		})
	} catch(e){
		console.log(e);
	}


});



	
