function sendMessageToContentScriptInCurrentTab(action) {
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{
				audiusToContentScript: true,
				action,
			},
			response => {
				console.log('current tab replied: ', response);
			}
		);
	});
}

// On click of extension icon show or hide the extension HTML in the current page.
chrome.browserAction.onClicked.addListener(tab => {
	// sendMessageToContentScriptInCurrentTab({ type: 'TOGGLE_EXTENSION' });
});

// Get the tab where Audius is running.
function getTab(callback) {
	chrome.tabs.getAllInWindow(null, tabs => {
		let tabsFiltered = tabs.filter(tab => tab.url === 'http://localhost:8080/');
		if (tabsFiltered.length) {
			callback(tabsFiltered[0]);
			return;
		}
		tabsFiltered = tabs.filter(tab => tab.url === 'https://audius.rockdapus.org/');
		if (tabsFiltered.length) {
			callback(tabsFiltered[0]);
			return;
		}
		callback();
	});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.audius) {
		getTab(tab => {
			if (!tab) sendMessageToContentScriptInCurrentTab({ type: 'ERROR_AUDIUS_TAB_MISSING' });
			else {
				if (request.action.type === 'SEARCH_AUDIUS_TAB') {
					sendMessageToContentScriptInCurrentTab({ type: 'AUDIUS_TAB_FOUND' });
				} else {
					chrome.tabs.sendMessage(tab.id, request, response => {
						console.log('Response from audius player tab: ' + response);
					});
				}
			}
		});
	}
});
