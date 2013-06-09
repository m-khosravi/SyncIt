define(
["syncitserv/view/extra/Common","dgrid/extensions/ColumnResizer",'dojo/store/Memory',"dojo/store/Observable"],
function(viewExtraCommon,ColumnResizer,Memory,Observable) {
	
// Author: Matthew Forrester <matt_at_keyboardwritescode.com>
// Copyright: Matthew Forrester
// License: MIT/BSD-style

return function(queueElementId,syncIt,syncItQueue) {
	
	var regenerateQueue = function(dojoStore,syncItQueue) {
		var i = 0,
			l = 0,
			id = '',
			ids = [];
		
		viewExtraCommon.emptyDojoStore(dojoStore);
		
		// Display Queue
		syncItQueue.getFullQueue(function(err,items) {
			for (i=0,l=items.length; i<l; i++) {
				dojoStore.put(items[i]);
			}
		});
	};

	var dojoStore = new Observable(new Memory({data:[]}));

	regenerateQueue(dojoStore,syncItQueue);

	var grid = viewExtraCommon.drawDisplay(
		queueElementId,
		[
			{label: 'Dataset', field: 's', sortable: false},
			{label: 'Datakey', field: 'k', sortable: false},
			{label: 'Operation', field: 'o', sortable: false},
			{
				label: 'Update',
				field: 'u',
				get: function(object) {
					return JSON.stringify(object.u);
				},
				sortable: false
			},
			{label: 'Based On Version', field: 'b', sortable: false},
			{label: 'Modifier', field: 'm', sortable: false}
		],
		dojoStore
	);

	syncIt.listenForApplied(function(dataset, datakey, queueitem, storerecord) {
		regenerateQueue(dojoStore,syncItQueue);
	});
	
	syncIt.listenForFed(function(queueitem, datakey, queueitem, storerecord) {
		regenerateQueue(dojoStore,syncItQueue);
	});
	
	syncIt.listenForAddedToQueue(function(dataset, datakey, queueitem) {
		regenerateQueue(dojoStore,syncItQueue);
	});

	return grid;
	
}

});