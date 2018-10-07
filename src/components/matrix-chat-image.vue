<script >
import { mapActions } from 'vuex';
import snarkdown from 'snarkdown';
import { zeroPad, urlify } from '../utils';

export default {
	props: {
		video: Object,
		isAuthor: Boolean,
		isAdmin: Boolean,
		membersIndex: Object,
	},
	data() {
		return {
			height: undefined,
			_width: 1,
		};
	},
	mounted() {
		if (this.event.w < this.event.h) {
			const h = this.$parent.$refs.matrixChat.offsetHeight;
			this.height = Math.round(h * 0.85);
			this._width = `${(this.event.w  / this.event.h ) * h * 0.85} px`;
		}
	},
	methods: {
		...mapActions(['matrixRedact', 'directMessage']),
		_snarkdown(md) {
			return snarkdown(md);
		},
		urlify(m) { return urlify(m); },
	},
	computed: {
		event() { return this.video; },
		sender() {
			const { sender } = this.event;
			return Object.assign({ id: sender, name: sender, nameColor: '' }, this.membersIndex[sender]);
		},
		_createdAt() {
			const date = new Date(this.event.createdAt);
			return `${date.getHours()}:${zeroPad(date.getMinutes(), 2)}`;
		},
		portrait() {
			return this.event.w < this.event.h;
		},
		/* eslint-disable consistent-return */
		width() {
			if (this.event.w > this.event.h) return '100%';
		},
	},
};
</script>

<template>
<li
	class="matrix-chat-image"
	:class="{
		'matrix-chat-message--author': isAuthor,
		'matrix-chat-message--sending': event.status === 'sending',
		'matrix-chat-image--portrait' : portrait,
	}">
	<div class="matrix-chat-image__image" :style="{width: _width}">
		<img
			:src="event.url"
			:alt="event.body"
			:height="height"
			:width="width">
		<div class="matrix-chat-image__overlay" ></div>
	</div>
	<div
		v-if="isAuthor || isAdmin"
		@click="matrixRedact(event)"
		class="wmp-icon-close matrix-chat-image__delete"
		title="Delete this message"></div>
	<div
		class="matrix-chat-image__footer">
		<div></div>
		<div class="matrix-chat-image__sender">
			<span :style="{ color: sender.nameColor }">
				{{sender.name}}
			</span>
			<span
				class="wmp-icon-chat"
				:title="'Chat with ' + sender.name"
				@click="directMessage(sender.id)"></span>
			</span>
		</div>
		<div class="matrix-chat-image__time">
			{{_createdAt}}
		</div>
	</div>
</li>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.matrix-chat-image
	position: relative
	font-size: .8rem
	text-align: center
	overflow: hidden
	&:hover
		.matrix-chat-image__overlay,
		.matrix-chat-image__footer,
		.matrix-chat-image__delete
			opacity: 1

$dark: rgba(0, 0, 0, .8)

.matrix-chat-image__overlay
	position: absolute
	bottom: 0
	left: 0
	width: 100%
	height: $touch-size-medium
	transition: opacity $transition-time
	background: $dark
	box-shadow: 0 0 #{2 * $grid-space} $grid-space $dark
	opacity: 0
.matrix-chat-image__image
	display: inline-block
	position: relative
	overflow: hidden

.matrix-chat-image__footer
	display: flex
	position: absolute
	bottom: 0
	left: 0
	align-items: center
	justify-content: space-between
	width: 100%
	padding: $grid-space
	background-color: transparent
	color: $color-catskillwhite
	opacity: 0
	[class^='wmp-icon-']
		width: $touch-size-small
		height: $touch-size-small
		cursor: pointer
.matrix-chat-image__time
	color: $color-aluminium-dark
.matrix-chat-image__sender
	display: flex
	align-items: center
	> span:not(:last-child)
		margin-right: #{2 * $grid-space}
.matrix-chat-image__delete
	position: absolute
	top: 0
	right: 0
	opacity: 0
	cursor: pointer
</style>
