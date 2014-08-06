enyo.kind({
	name: "JulzMochi.MainView",
	classes: "mochi mochi-sample enyo-fit",
	kind: "FittableRows",
	components: [
		/*{name: "list", kind: "mochi.List", count: 200, multiSelect: false, classes: "enyo-fit list-sample-list", onSetupItem: "setupItem", components: [
			{name: "item", kind:"mochi.ListItem", components: [
				{name: "index", classes: "list-sample-index"},
				{name: "name"}
			]}
		]}*/
		{name: "repeater", kind: enyo.DataRepeater, components: [
			{components: [
				{kind: "mochi.ListItem", components: [
					{name: "titledesc", style: "overflow: auto;", tag: "div", components: [
						{name: "moviepic", tag: "img", classes:"movieinfo_poster"},
						{tag: "div", style: "margin-bottom: 20px;", components: [
							{name: "title", classes: "program_title", tag: "span"},
							{tag: "span", style: "margin-left: 10px;", content: "("},
							{name: "releaseYear", classes: "program_releaseYear", tag: "span"},
							{tag: "span", content: ")"},
						]},
						{name: "description", classes: "program_description", tag: "div"},
					]}
				], ontap: "domovie"}
			], bindings: [
				{from: ".model.metadata.title", to: ".$.title.content"},
				{from: ".model.metadata.releaseYear", to: ".$.releaseYear.content"},
				{from: ".model.metadata.description", to: ".$.description.content"},
				{from: ".model.images.bestpic", to: ".$.moviepic.src", transform: function(v) {
					//console.log('-transform'); console.log(this); 
					//console.log(this.model.attributes.images);
					var pic = this.model.attributes.images.bestpic;
					console.log(pic);
					return pic;
				}},
				{from: ".model.images", to: "*", transform: function(v) {
					//console.log(v);
					
					var basepath = 'http://upperdeck-images.digitalsmiths.com/photos/';
					var bestpic = null;
					if (v.dvdboxart) {
						bestpic = getPreferredImage(v.dvdboxart);
					}
					else if (v.movieposters) {
						bestpic = getPreferredImage(v.movieposters);
					}
					else if (v.tvbanners) {
						bestpic = getPreferredImage(v.tvbanners);
					}
					var pic = bestpic.attributes && bestpic.attributes.URI ? String(basepath + bestpic.attributes.URI) : null;
					
					function getPreferredImage(obj) {
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
					//console.log(this);
					//console.log(pic);
					//console.log('this.model.attributes.images: ');
					//console.log(this.model.attributes.images);
					//this.model.attributes.images.set('bestpic', pic);
					this.model.attributes.images.bestpic = pic;
					//console.log(this.model.attributes.images);
					return pic;
				}},
				{from: ".model", to: "*", transform: function(v) {
					//console.log(this.owner.$.repeater.reflow());
				}}
			], domovie: function(inSender, inEvent) {
					console.log('domovie');
					console.log(inSender);
				}
			}
		]}
	],
	bindings: [
		{from: ".collection", to: ".$.repeater.collection", transform: function(v) {
			if (!v) return;
			var results = new Array();
			for (var i=0; i<v.length; i++) {
				results.push(v[i]);
			}
			return new enyo.Collection(results);
		}}
	],
});
