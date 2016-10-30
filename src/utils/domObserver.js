import findVideos from './findVideos';

// Watch if the DOM changes, rescan the DOM for new links to music

// create an observer instance
var observer = new MutationObserver(mutations => {
	console.log('The DOM changed!');
	findVideos();
	// mutations.forEach(mutation => {
	//   console.log(mutation.type);
	// });
});

// pass in the target node, as well as the observer options
observer.observe(
	// the target node
	document.querySelector('body'),
	// configuration of the observer:
	{
		subtree: true,
		childList: true,
		characterData: true,
	}
);
// later, you can stop observing
// observer.disconnect();
