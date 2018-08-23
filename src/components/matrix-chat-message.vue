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
			return (this.membersIndex[this.event.sender] && this.membersIndex[this.event.sender].name) || this.event.sender;
		},
		nameColor() {
			return (this.membersIndex[this.event.sender] && this.membersIndex[this.event.sender].nameColor);
		},
		createdAt() {
			return this.event.createdAt;
		},

		_createdAt() {
			const date = new Date(this.createdAt);
			return `${date.getHours()}:${zeroPad(date.getMinutes(), 2)}`;
		},
		messages() {
			let currentEvent = this.event;
			const children = [currentEvent.body];
			console.log("currentEvent.body", currentEvent.body);
			while (currentEvent.childEvent) {
				currentEvent = currentEvent.childEvent;
				children.push(currentEvent.body);
			}
			console.log("children", children);
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
		<div class="matrix-chat-message__header" v-bind:style="{ color: nameColor }">
			{{sender}}
		</div>
		<div class="matrix-chat-message__body">
			<div v-for="message in messages">
				<span v-html="message"></span>
				<div class="matrix-chat-message__delete" v-if="userIsAuthor">
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
	// display: none
	position: absolute
	top: 0
	right: 0
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
