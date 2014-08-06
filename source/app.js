/**
	Define and instantiate your enyo.Application kind in this file.  Note,
	application rendering should be deferred until DOM is ready by wrapping
	it in a call to enyo.ready().
*/

enyo.kind({
	name: "JulzMochi.Application",
	kind: "enyo.Application",
	view: "JulzMochi.MainView",
    components: [
    	//{name: "actorcollection", kind: JulzMochi.ActorController, actor: "Brad Pitt"}
    	{name: "actorcollection", kind: JulzMochi.ActorController_custom, actor: "Brad Pitt"}
    ],
    /*create: function() {
    	console.log('-create');
    	this.inherited(arguments);
		//this.collection = new JulzMochi.ActorController({actor: 'Brad Pitt'});
		//this.collection.fetch();
    },*/
    bindings: [
    	{from: ".$.actorcollection.collection", to:".$.mainView.collection"}
    ]
});

enyo.ready(function () {
	new JulzMochi.Application({name: "app"});
});
