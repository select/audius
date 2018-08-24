<script >
import { zeroPad } from '../utils';

export default {
	props: {
		video: Object,
		userIsAuthor: Boolean,
		membersIndex: Object,
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
			const children = [currentEvent.body];
			while (currentEvent.childEvent) {
				currentEvent = currentEvent.childEvent;
				children.push(currentEvent.body);
			}
			return children;
		},
	},
};
</script>

<template>
<li
	class="matrix-chat-message"
	:class="{'matrix-chat-message--author': userIsAuthor}">
	<div class="matrix-chat-message__container">
		<div class="matrix-chat-message__header" v-bind:style="{ color: sender.nameColor }">
			{{sender.name}}
		</div>
		<div class="matrix-chat-message__body">
			<div v-for="message in messages">
				<span v-html="message"></span>
				<div class="matrix-chat-message__delete" v-if="userIsAuthor || true">
					<span class="wmp-icon-close"></span>
				</div>
			</div>
		</div>
		<div class="matrix-chat-message__footer">{{_createdAt}}</div>
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
	cursor: pointer
	color: $color-aluminium-dark
	> span
		width: #{3 * $grid-space}
		height: #{3 * $grid-space}
		font-size: 0.5rem
.matrix-chat-message__container
	position: relative
	max-width: 25rem
	margin: $grid-space #{2 * $grid-space}
	border-radius: $border-radius
	border-top-left-radius: 0
	font-size: .8em
	&::before
		position: absolute
		top: 0
		left: -$grid-space
		border-top: $grid-space solid $color-catskillwhite
		border-bottom: $grid-space solid transparent
		border-left: $grid-space solid transparent
		content: ' '

.matrix-chat-message__header,
.matrix-chat-message__body > div,
.matrix-chat-message__footer
	padding: 0 $grid-space
	background: $color-catskillwhite

.matrix-chat-message__body
	display: flex
	flex-direction: column
	> div
		text-overflow: ellipsis
		overflow: hidden
		&:not(:last-child):not(:first-child)
			padding: #{2 * $grid-space}
		&:first-child
			padding-bottom: $grid-space
		&:last-child
			padding-top: $grid-space
		&:not(:last-child)
			margin-bottom: $grid-space/2
		&:not(:first-child)
			position: relative
		&:hover
			.matrix-chat-message__delete
				display: block
.matrix-chat-message__footer
	display: flex
	justify-content: flex-end
	color: $color-aluminium-dark

.matrix-chat-message__header
	padding: $grid-space
	color: $color-aluminium-dark
	font-weight: bold
</style>
