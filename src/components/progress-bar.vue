<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
	created() {
		this.dragLimitElement = {};
		// if media changed, set new media in player
		this.$store.watch(state => state.currentMedia, () => {
			const duration = this.currentMedia.durationAlbum || this.currentMedia.durationS;
			if (this.currentMedia.start) {
				this.limitEls.start.style.left = `${(this.currentMedia.start / duration) * 100}%`;
			} else this.limitEls.start.style.left = '0%';
			if (this.currentMedia.stop) {
				this.limitEls.stop.style.right = `${100 - ((this.currentMedia.stop / duration) * 100)}%`;
			} else this.limitEls.stop.style.right = '0%';
		});
	},
	methods: {
		...mapMutations([
			'setStartStopMarker',
		]),
		skipToTime(event) {
			if (this.currentMedia.id) {
				const rect = this.$el.getBoundingClientRect();
				const duration = this.currentMedia.durationAlbum || this.currentMedia.durationS;
				this.$store.commit(
					'skipToTime',
					duration * ((event.clientX - rect.left) / rect.width)
				);
			}
		},
		onDragStart(event) {
			event.dataTransfer.setDragImage(this.dragImg, 0, 0);
		},
		moveLimit(event, elName) {
			let pos = Math.round((event.clientX / this.progressPos.xMax) * 100);
			if (pos > 100) pos = 100;
			else if (pos < 0) pos = 0;
			if (
				(elName === 'start' && pos < this.limitPos.stop)
				|| (elName === 'stop' && this.limitPos.start < pos)
			) {
				if (elName === 'start') this.limitEls[elName].style.left = `${pos}%`;
				else this.limitEls[elName].style.right = `${100 - pos}%`;
			}
		},
		dropLimit(event, elName) {
			let pos = Math.round((event.clientX / this.progressPos.xMax) * 100);
			if (
				(elName === 'start' && pos < this.limitPos.stop)
				|| (elName === 'stop' && this.limitPos.start < pos)
			) {
				if (this.currentMedia.id) {
					const duration = this.currentMedia.durationAlbum || this.currentMedia.durationS;
					this.setStartStopMarker({
						type: elName,
						seconds: Math.round(duration * (pos / 100)),
					});
				}
				if (pos > 100) pos = 100;
				else if (pos < 0) pos = 0;
				this.limitPos[elName] = pos;
				if (elName === 'start') this.limitEls[elName].style.left = `${pos}%`;
				else this.limitEls[elName].style.right = `${100 - pos}%`;
			}
		},
	},
	computed: {
		...mapGetters([
			'progressWidth',
		]),
		...mapState([
			'currentTime',
			'currentMedia',
			'isPlaying',
		]),
	},
	mounted() {
		this.dragImg = document.createElement('img');
		this.limitEls = {
			start: this.$el.querySelector('.au-header__progress-limit-start'),
			stop: this.$el.querySelector('.au-header__progress-limit-stop'),
		};
		const progressEl = this.$el;
		const rect = progressEl.getBoundingClientRect();
		this.progressPos = {
			x: rect.left,
			xMax: rect.right,
		};
		this.limitPos = { start: 0, stop: rect.right };

		const mouseEl = this.$el.querySelector('.au-header__progress-mouse');
		progressEl.addEventListener('mousemove', (event) => {
			mouseEl.style.left = `${event.clientX - this.progressPos.x}px`;
		}, false);
	},
};
</script>

<template lang="html">
	<div class="au-header__progress" @click.stop="skipToTime">

		<div class="au-header__progress-inner">
			<div
				v-if="currentMedia.id"
				v-bind:style="{ width: progressWidth + '%' }"
				class="au-header__progress-current"></div>
		</div>
		<div class="au-header__progress-mouse"></div>
		<div
			draggable="true"
			title="drag start limit"
			@dragstart="onDragStart"
			@drag="moveLimit($event, 'start')"
			@dragend="dropLimit($event, 'start')"
			class="au-header__progress-limit-start"></div>
		<div
			draggable="true"
			title="drag stop limit"
			@dragstart="onDragStart"
			@drag="moveLimit($event, 'stop')"
			@dragend="dropLimit($event, 'stop')"
			class="au-header__progress-limit-stop"></div>
	</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.au-header__progress
	position: absolute
	z-index: 1
	bottom: 0
	width: 100%
	height: 2*$grid-space
	transition: all $transition-time
	cursor: pointer
	background: transparent
	display: flex
	&:hover
		.au-header__progress-mouse,
		.au-header__progress-limit-stop,
		.au-header__progress-limit-start
			display: block
		.au-header__progress-current
			&:after
				content: ''
				width: #{2 * $grid-space}
				height: #{2 * $grid-space}
				border-radius: 50%
				position: absolute
				bottom: -$grid-space*0.7
				right: -3px
				background: $color-pictonblue
.au-header__progress-inner
	position: absolute
	bottom: 0
	width: 100%
	height: $grid-space/2
	background: $color-aluminium

.au-header__progress-current
	position: relative
	background: $color-pictonblue
	height: 100%
	height: $grid-space/2


.au-header__progress-mouse
	display: none
	width: $grid-space
	height: $grid-space
	background: $color-clementine
	position: absolute
	bottom: -$grid-space*0.2
	border-radius: 50%

.au-header__progress-limit-stop,
.au-header__progress-limit-start
	display: none
	position: absolute
	bottom: 0
	width: 3*$grid-space
	height: 3*$grid-space
	border: 2px solid $color-aluminium-dark
	border-top-color: transparent
	cursor: ew-resize
	&:hover

		border-color: $color-clementine
		border-top-color: transparent

.au-header__progress-limit-start.au-header__progress-limit-start
	left: 0
	border-right-color: transparent

.au-header__progress-limit-stop.au-header__progress-limit-stop
	right: 0
	border-left-color: transparent

</style>
