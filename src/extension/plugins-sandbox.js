
const logger = window.console.log;

/* eslint-disable no-eval */
const pluginSandbox = {
	parsers: {},
	currentParser: '',
	ajaxJSON(url, id) {
		this.message({ ajaxJSON: url, id });
	},
	init() {
		window.addEventListener('message', event => {
			logger('## sb event recieved', event.data);
			if (!this.messageSource) {
				if (event.data.handshakeSandbox) {
					logger('## sb handshake complete');
					this.messageSource = event.source;
					this.messageOrigin = event.origin;
					this.message({ handshakeSandbox: true });
				}
			}
			if (event.data.type === 'loadScript') this.loadScript(event.data);
			else if (event.data.type === 'getNext') this.getNext(event.data.id);
			else if (event.data.type === 'parse') {
				try {
					this.message({
						audius: true,
						vuex: 'dispatch',
						type: 'webScraperUpdateSuccess',
						data: {
							id: event.data.id,
							mediaList: this.parsers[event.data.id].parse(event.data.data),
						},
					});
				} catch (error) {
					this.message({ audius: true, vuex: 'commit', type: 'error', data: `Error parsing ${event.data.id}. ${error}` });
				}
			}
		});
	},

	message(data) {
		this.messageSource.postMessage(data, this.messageOrigin);
	},
	getNext(id) {
		try {
			const [method, url] = this.parsers[id].getUrl();
			this[method](url, id);
		} catch (error) {
			this.message({ audius: true, vuex: 'commit', type: 'error', data: `Error getting next page. ${error}` });
		}
	},
	loadScript(options) {
		const { id, code } = options;
		if (this.parsers[id]) this.message({ audius: true, vuex: 'commit', type: 'error', data: `Script '${id}' is already loaded` });
		try {
			this.parsers[id] = eval(code);
			const [method, url] = this.parsers[id].getUrl();
			this[method](url, id);
			this.message(options.responseTemplate);
		} catch (error) {
			this.message({ audius: true, vuex: 'commit', type: 'error', data: `Error loading script. ${error}` });
		}
	},
};

logger('# Plugin sandbox');
pluginSandbox.init();
