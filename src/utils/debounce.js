/**
 * ##customDebounce
 * Debounce Immediatly (custom made) - Fire once immediately and then when
 * the last change was done once again but take care that we do not fire
 * twice on the first time we fired
 * http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
 * @param {function} func founction to debounce
 * @param {number} wait number of milliseconds to wait
 * @return {function}      debounced function
 */
export function debounceImmediate(func, wait = 500) {
	// we need to save these in the closure
	let timeout;
	let args;
	let context;
	let timestamp;
	let callCount = 0;
	return function() {
		// save details of latest call
		context = this;
		args = [].slice.call(arguments, 0);
		timestamp = new Date();
		// immediately fire on the first call
		if (callCount === 0) {
			func.apply(context, args);
		}
		++callCount;
		// this is where the magic happens
		const later = () => {
			// how long ago was the last call
			const last = new Date() - timestamp;
			// if the latest call was less that the wait period ago
			// then we reset the timeout to wait for the difference
			if (last < wait) {
				timeout = setTimeout(later, wait - last);
				// or if not we can null out the timer and run the latest
			} else {
				timeout = null;
				// only fire if this was not the first call (index 0), first call aready fired
				if (callCount > 1) {
					func.apply(context, args);
				}
				callCount = 0; // time is over reset the counter
			}
		};
		// we only need to set the timer now if one isn't already running
		if (!timeout) {
			timeout = setTimeout(later, wait);
		}
	};
}

export function debounce(func, wait = 500) {
	// we need to save these in the closure
	let timeout;
	let args;
	let context;
	let timestamp;

	return function() {
		// save details of latest call
		context = this;
		args = [].slice.call(arguments, 0);
		timestamp = new Date();

		// this is where the magic happens
		const later = () => {
			// how long ago was the last call
			const last = new Date() - timestamp;

			// if the latest call was less that the wait period ago
			// then we reset the timeout to wait for the difference
			if (last < wait) {
				timeout = setTimeout(later, wait - last);

				// or if not we can null out the timer and run the latest
			} else {
				timeout = null;
				func.apply(context, args);
			}
		};

		// we only need to set the timer now if one isn't already running
		if (!timeout) {
			timeout = setTimeout(later, wait);
		}
	};
}

// https://remysharp.com/2010/07/21/throttling-function-calls
export function throttle(fn, threshhold, scope) {
	threshhold || (threshhold = 250);
	let last;
	let deferTimer;
	return function() {
		const context = scope || this;

		const now = +new Date();
		const args = arguments;
		if (last && now < last + threshhold) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function() {
				last = now;
				fn.apply(context, args);
			}, threshhold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
}
