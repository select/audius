import findVideos from './findVideos';


if (!document.querySelectorAll('#audius-website').length) {
	// Watch if the DOM changes, rescan the DOM for new links to music
	const observer = new MutationObserver(() => {
		findVideos();
	});

	observer.observe(
		document.querySelector('body'),
		{
			subtree: true,
			childList: true,
			characterData: true,
		}
	);
	// later, you can stop observing
	// observer.disconnect();
}
