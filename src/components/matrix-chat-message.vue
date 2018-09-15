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
	methods: {
		...mapActions(['matrixRedact']),
		_snarkdown(md) {
			return snarkdown(md);
		},
		urlify(m) { return urlify(m); },
	},
	computed: {
		event() { return this.video; },
		sender() {
			const { sender } = this.event;
			return this.membersIndex[sender] || { name: sender, nameColor: '' }
		},
		_createdAt() {
			const date = new Date(this.event.createdAt);
			return `${date.getHours()}:${zeroPad(date.getMinutes(), 2)}`;
		},
		messages() {
			let currentEvent = this.event;
			const children = [currentEvent];
			while (currentEvent.childEvent) {
				currentEvent = currentEvent.childEvent;
				children.push(currentEvent);
			}
			return children;
		},
	},
};
</script>

<template>
<li
	class="matrix-chat-message"
	:class="{'matrix-chat-message--author': isAuthor}">
	<div class="matrix-chat-message__container">
		<div class="matrix-chat-message__header" v-bind:style="{ color: sender.nameColor }">
			{{sender.name}}
		</div>
		<div class="matrix-chat-message__body">
			<div
				v-for="message in messages"
				:class="{'matrix-chat-message--sending': message.status === 'sending'}"
				>
				<span v-if="message.body" v-html="urlify(_snarkdown(message.body))"></span>
				<div
					v-if="message.url"
					class="matrix-chat-message__image"
					v-bind:style="{ backgroundImage: 'url('+message.url+')' }">
				</div>
				<div
					v-if="isAuthor || isAdmin"
					@click="matrixRedact(message)"
					class="wmp-icon-close matrix-chat-message__delete"
					title="Delete this message"></div>
			</div>
		</div>
		<div
			:class="{'matrix-chat-message--sending': messages[messages.length -1].status === 'sending'}"
			class="matrix-chat-message__footer">{{_createdAt}}</div>
	</div>
</li>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.matrix-chat-message
	display: flex
	position: relative
	&.matrix-chat-message--author
		justify-content: flex-end
		.matrix-chat-message__header
			display: none
		.matrix-chat-message__container
			border-top-left-radius: $border-radius
			border-top-right-radius: 0
			color: $color-catskillwhite
			&::before
				right: -$grid-space
				left: auto
				border: 0
				border-top: $grid-space solid $color-pictonblue
				border-right: $grid-space solid transparent
			&:hover
				&::before
					border-top-color: $color-pictonblue
		.matrix-chat-message__body > div:first-child
			padding-top: $grid-space
		.matrix-chat-message__header,
		.matrix-chat-message__body > div,
		.matrix-chat-message__footer
			background: $color-pictonblue
.matrix-chat-message__delete
	display: none
	position: absolute
	top: 0
	right: 0
	width: #{3 * $grid-space}
	height: #{3 * $grid-space}
	color: $color-aluminium-dark
	font-size: .5rem
	cursor: pointer
.matrix-chat-message__container
	position: relative
	max-width: 25rem
	margin: $grid-space 5.5%
	border-radius: $border-radius
	border-top-left-radius: 0
	font-size: .8em
	&::before
		position: absolute
		top: 0
		left: -$grid-space
		border-top: $grid-space solid $color-white
		border-bottom: $grid-space solid transparent
		border-left: $grid-space solid transparent
		content: ' '

.matrix-chat-message__header,
.matrix-chat-message__body > div,
.matrix-chat-message__footer
	padding: 0 $grid-space
	background-color: $color-white

.matrix-chat-message__body
	display: flex
	flex-direction: column
	> div
		position: relative
		padding: #{2 * $grid-space}
		text-overflow: ellipsis
		overflow: hidden
		&:not(:last-child):not(:first-child)
			padding: $grid-space #{2 * $grid-space}
		&:first-child
			padding-bottom: $grid-space
		&:last-child
			padding-bottom: 0
		&:last-child
			padding-top: $grid-space
		&:not(:last-child)
			margin-bottom: $grid-space / 2
			border-radius: $border-radius
			box-shadow: 0 1px .5px rgba(0, 0, 0, .13)
		&:not(:first-child)
			position: relative
		&:hover
			.matrix-chat-message__delete
				display: block
.matrix-chat-message--sending
	opacity: 0.5

.matrix-chat-message__footer
	display: flex
	justify-content: flex-end
	border-bottom-left-radius: $border-radius
	border-bottom-right-radius: $border-radius
	color: $color-aluminium-dark
	box-shadow: 0 1px .5px rgba(0, 0, 0, .13)

.matrix-chat-message__header
	padding: $grid-space
	border-top-left-radius: $border-radius
	border-top-right-radius: $border-radius
	color: $color-aluminium-dark
	font-weight: bold

.matrix-chat-message__image
	width: 100%
	height: 200px
	background-repeat: no-repeat
	background-position: center
	background-size: contain
</style>
