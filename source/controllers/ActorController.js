enyo.kind({
	name: "JulzMochi.ActorController",
	kind: "enyo.Collection",
	model: "JulzMochi.ActorModel",
	url: "https://discovery-demo.digitalsmiths.net/sd/x180253fd/cores/assets-tms/search?q=cast.name:Brad+Pitt&fl=genres,id,title,description,releaseYear,score,cast,images,netflix,hulu&limit=10",
	//source: "jsonp",        // use jsonp source instead of ajax for fetching
	//source: "json",        // use jsonp source instead of ajax for fetching
	//source: "ajax",        // use jsonp source instead of ajax for fetching
	getUrl: function() {
		console.log('geturl');
		return enyo.format(this.url, this.actor);
	},
	parse: function(data) {
		console.log('parse');
		return data.hits;
	},
});


enyo.kind({
	name: "JulzMochi.ActorController_custom",
	kind: "JulzMochi.ActorController",
	fetchJsonP: function(inSender, inEvent) {
		console.log('--fetch');
		var jsonp = new enyo.JsonpRequest({url: this.getUrl()});
		jsonp.response(this, "processResponse");
		jsonp.error(this, "processError");
		jsonp.go();
		//console.log('jsonp:');
		//console.log(jsonp);
	},
	fetch: function() {
		console.log('fetch');
		var ajax = new enyo.Ajax({
			//url: this.$.baseUrl.getValue()
			url: this.getUrl()
		});
		// send parameters the remote service using the 'go()' method
		ajax.go({
			//q: this.$.query.getValue()
			q: ''
		});
		// attach responders to the transaction object
		ajax.response(this, "processResponse");
		// handle error
		ajax.error(this, "processError");
	},
	processResponse: function(inSender, inResponse) {
		console.log('--response success');
		//var data = inResponse.hits;
		var data = new Array();
		for (var i=0; i<inResponse.hits.length; i++) {
			//data.push(new JulzMochi.ActorModel(inResponse.hits[i]));
			var model = new IMDBerbessou.ProgramModel(new enyo.Model(inResponse.hits[i]));
			model.parse();
			data.push(model);
			//var model = new IMDBerbessou.ProgramModel(inResponse.hits[i]);
			//model.doParse();
			//data.push(model);
		}
		console.log(data);
		//this.set("data", data);
		this.set("collection", data);
		//return data;
	},
	processError: function(inSender, inResponse) {
		console.log('--response error');
		var errorLog = "Error" + ": " + inResponse + "! " + (JSON.parse(inSender.xhrResponse.body)).error.description;
		console.log(errorLog);
		console.log(JSON.stringify(inSender.xhrResponse, null, 2));
	},
	options: {fetch: true}
});

enyo.kind({
	name: "JulzMochi.ActorModel",
	kind: enyo.Model,
	primaryKey: "_id",
	parse: function(data) {
		console.log('--actormodel');
		console.log(data);
		data.metadata = new enyo.Model(data.metadata);
		return data;
	},
	doParse: function() {
		console.log('doParse');
	}
});

enyo.kind({
	name: "IMDBerbessou.ProgramModel",
	kind: enyo.Model,
	primaryKey: "_id",
	//parse: function (data) {
	parse: function () {
		console.log('--programmodel.parse');
		console.log(this);
		var data = new Object();
		data.metadata = new IMDBerbessou.ProgramMetadata(data.metadata);
		data.images = new IMDBerbessou.ProgramImages(data.images);
		return data;
	}
});

enyo.kind({
	name: "IMDBerbessou.ProgramImages",
	kind: enyo.Model,
	primaryKey: "_id",
	parse: function(data) {
		console.log('--programimages.parse');
		var basepath = 'http://upperdeck-images.digitalsmiths.com/photos/';
		var bestpic = null;
		if (data.dvdboxart) {
			bestpic = this.getPreferredImage(data.dvdboxart);
		}
		else if (data.movieposters) {
			bestpic = this.getPreferredImage(data.movieposters);
		}
		else if (data.tvbanners) {
			bestpic = this.getPreferredImage(data.tvbanners);
		}
		data.bestpic = bestpic.attributes && bestpic.attributes.URI ? String(basepath + bestpic.attributes.URI) : null;
		
		console.log('*bestpic.attributes:');
		if (bestpic && bestpic.attributes) {
			console.log(bestpic.attributes);
		} else {
			console.log('-bestpic:');
			console.log(bestpic);
		}
		
		return data;
	},
	
	getPreferredImage: function(obj) {
		console.log('getPreferredImage');
		var prefOrder = ['v6','h5','v2','h3','v5','v3'];
		var pref;
		for (var i in prefOrder) {
			//console.log(i + ': ' + prefOrder[i]);
			//console.log(obj[prefOrder[i]]);
			if (!pref) pref = obj[prefOrder[i]];
		}
		return new enyo.Model(pref);
		 // h3 - 270h 360w
		 // h5 - 135h 180w
		// h6 - 540h 720w
		// h9 - 1080h 1440w
		 // v2 - 180h 135w
		 // v3 - 360h 270w
		// v4 - 720h 540w
		// --------------------
		 // v5 - 360h 240w
		 // v6 - 180h 120w
		// v7 - 720h 480w
		// v8 - 1440h 960w
		// v9 - 1440h 1080w
	}
});

enyo.kind({
	name: "IMDBerbessou.ProgramMetadata",
	kind: enyo.Model,
	primaryKey: "_id",
	parse: function(data) {
		if (data.cast) {
			data.cast = new enyo.Collection(data.cast);
		}
		return data;
	}
});

