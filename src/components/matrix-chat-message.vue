<script >
import { zeroPad } from '../utils';

export default {
	props: {
		sender: String,
		createdAt: Number,
		video: { type: Array, required: true },
		userIsAuthor: Boolean,
		nameColor: String,
	},
	computed: {
		_createdAt() {
			const date = new Date(this.createdAt);
			return `${date.getHours()}:${zeroPad(date.getMinutes(), 2)}`;
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
			<div
				v-for="message in video"
				v-html="message"></div>
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
			color: $color-white
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
		border-top: $grid-space solid $color-white
		border-bottom: $grid-space solid transparent
		border-left: $grid-space solid transparent
		content: ' '

.matrix-chat-message__header,
.matrix-chat-message__body > div,
.matrix-chat-message__footer
	padding: 0 $grid-space
	background: $color-white

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
.matrix-chat-message__footer
	display: flex
	justify-content: flex-end
	color: $color-aluminium-dark

.matrix-chat-message__header
	padding: $grid-space
	color: $color-aluminium-dark
	font-weight: bold
</style>
