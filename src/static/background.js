function requestProcessor(details) {
	alert(details.url+' => '+JSON.stringify(details.responseHeaders));
	var headers = details.responseHeaders;
	const h = headers.filter(h => h.name.toLowerCase() === 'content-security-policy' || h.name.toLowerCase() === 'x-webkit-csp')
	// for (var j = 0, jLen = headers.length; j !== jLen; ++j) {
	// 	var header = headers[j];
	// 	var name = header.name.toLowerCase();
	// 	if (name !== "content-security-policy" &&
	// 		name !== "x-webkit-csp") {
	// 		continue;
	// 	}
	// 	for (var k = 0, kLen = subrules.length; k !== kLen; ++k) {
	// 		header.value = header.value.replace(subrules[k][0],subrules[k][1]);
	// 	}
	// }
	return {responseHeaders: headers};
}

chrome.webRequest.onHeadersReceived.addListener(requestProcessor, {
	urls: ["*://*/*"],
	types: ["main_frame", "sub_frame"]
}, ["blocking", "responseHeaders"]);
