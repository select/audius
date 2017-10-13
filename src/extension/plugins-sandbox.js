const logger = window.console.log;

/* eslint-disable no-eval */
const pluginSandbox = {
	parsers: {},
	youtubeApiKey: '',
	init() {
		window.addEventListener('message', event => {
			logger('## sandbox event', event.data);
			if (!this.messageSource) {
				logger('## sandbox handshake complete');
				this.messageSource = event.source;
				this.messageOrigin = event.origin;
			}
			if (event.data.type === 'loadScript') this.loadScript(event.data);
			else if (event.data.type === 'getNext') this.getNext(event.data.id);
			else if (event.data.id in this.parsers && event.data.type in this.parsers[event.data.id]) {
				let parseResult;
				try {
					parseResult = this.parsers[event.data.id][event.data.type](event.data.data);
				} catch (error) {
					this.message({
						audius: true,
						vuex: 'commit',
						type: 'error',
						data: `Error parsing ${event.data.id}. ${error}`,
					});
				}
				if (['getYouTubeInfo', 'scanOneUrl', 'ajaxRaw', 'ajaxJSON'].includes(parseResult.type)) {
					this.message(
						Object.assign(parseResult, { id: event.data.id, youtubeApiKey: this.youtubeApiKey })
					);
				} else if (parseResult.type === 'mediaList') {
					this.message({
						audius: true,
						vuex: 'dispatch',
						type: 'webScraperUpdateSuccess',
						data: {
							id: event.data.id,
							mediaList: parseResult.data,
						},
					});
				} else if (parseResult.type === 'noop') {
					// Don't do anything, relax.
				} else {
					this.message({
						audius: true,
						vuex: 'commit',
						type: 'error',
						data: `Unknown plugin command ${parseResult[0]}.`,
					});
				}
			}
		});
	},

	message(data) {
		this.messageSource.postMessage(data, this.messageOrigin);
	},
	getNext(id) {
		try {
			const result = this.parsers[id].getUrl();
			this.message(Object.assign(result, { id })); // parser calls getJSON
		} catch (error) {
			this.message({
				audius: true,
				vuex: 'commit',
				type: 'error',
				data: `Error getting next page. ${error}`,
			});
		}
	},
	loadScript(options) {
		const { id, code, youtubeApiKey } = options;
		if (this.parsers[id])
			this.message({
				audius: true,
				vuex: 'commit',
				type: 'error',
				data: `Script '${id}' is already loaded`,
			});
		try {
			this.parsers[id] = eval(code);
			if (options.responseTemplate) this.message(options.responseTemplate);
			this.youtubeApiKey = youtubeApiKey;
			this.getNext(id);
		} catch (error) {
			this.message({
				audius: true,
				vuex: 'commit',
				type: 'error',
				data: `Error loading script. ${error}`,
			});
		}
	},
};

logger('# Plugin sandbox');
pluginSandbox.init();
