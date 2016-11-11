let audiusWebsiteTab = undefined;

chrome.tabs.getAllInWindow(null, function(tabs) {
	let tabsFiltered = tabs.filter(tab => tab.url === 'http://localhost:8080/');
	if (tabsFiltered.length) {
		audiusWebsiteTab = tabsFiltered[0];
	} else {
		tabsFiltered = tabs.filter(tab => tab.url === 'http://audius.rockdapus.org/');
		if (tabsFiltered.length) {
			audiusWebsiteTab = tabsFiltered[0];
		}
	}
	if(audiusWebsiteTab) {
		console.log('got tab: ', audiusWebsiteTab.url);
	} else {
		console.log('failed getting tab');
	}

});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.audius) {
		chrome.tabs.sendMessage(audiusWebsiteTab.id, request, (response) => {
			console.log('response from audius player tab');
		});
	}
});

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
	if (['http://localhost:8080', 'http://audius.rockdapus.org'].contains(sender.url))
		console.log('request from audius: ', request);
});
