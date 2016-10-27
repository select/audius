import './app.sass';

const YOUTUBE_API_KEY = 'AIzaSyCHVgsa5owudn4G79IX9pcRcrVNOmgKHuM';


function ajax(url, callback) {
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = () => {
		if (xmlhttp.readyState === 4) {
			if (xmlhttp.status === 200) callback(JSON.parse(xmlhttp.responseText));
			else console.warn('error loading ' + url);
		}
	};
	xmlhttp.open('GET', url, true);
	xmlhttp.send();
}


const appEl = document.createElement('div');
appEl.id = 'whatsapp-web-media-player';
appEl.innerHTML = require('./app.html');
const bodyEl = document.querySelector('body');
bodyEl.insertBefore(appEl, bodyEl.firstChild);


const youtubeRegEx = /(youtube.com)|(youtu.be)/;
const youtubeExtract1 = /youtu.be\/([\w-]+)/;
const youtubeExtract2 = /youtube.com\/watch\?v=([\w-]+)/;

const mediaListEl = document.querySelector('.wamp__media-list');
document.querySelector('.wamp__scan').addEventListener('click', () => {
	const youtubeUrls = Array
		.from(document.querySelectorAll('a'))
		.map(el => el.href.match(youtubeRegEx) ? el.href : null)
		.filter(link => link);
	let ids = [
		...youtubeUrls
			.map(link => {
				const match = link.match(youtubeExtract1);
				return match ? match[1] : undefined;
			}),
		...youtubeUrls
			.map(link => {
				const match = link.match(youtubeExtract2);
				return match ? match[1] : undefined;
			}),
	];
	ids = ids
		.filter(id => id) // filter empty
		.filter((item, pos, self) => self.indexOf(item) === pos); // filter dublicates
	const url = `https://www.googleapis.com/youtube/v3/videos?&part=snippet,contentDetails&id=${ids.join(',')}&key=${YOUTUBE_API_KEY}`;
	ajax(url, data => {
		data.items.forEach(videoResource => {
			var durationMatch = videoResource.contentDetails.duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
			const duration = {
				h: parseInt(durationMatch[1], 10) || 0,
				m: parseInt(durationMatch[2], 10) || 0,
				s: parseInt(durationMatch[3], 10) || 0,
			};
			const el = document.createElement('li');
			el.innerHTML = `
				<div class="thumbnail" style="background-image: url(${videoResource.snippet.thumbnails.default.url})"></div>
				<div class="body">
					<div class="name">${videoResource.snippet.title}</div>
					<div class="duration">${duration.m}:${duration.s}</div>
				</div>
				<div class="wamp-item__controls">
					<span class="icon-play"></span>
				</div>
			`;
			mediaListEl.appendChild(el);
		});
	});
});


// Watch if the DOM changes, rescan the DOM for new links to music

// create an observer instance
var observer = new MutationObserver(mutations => {
	console.log('The DOM changed!');
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
		attributes: true,
		childList: true,
		characterData: true,
	}
);
// later, you can stop observing
observer.disconnect();
