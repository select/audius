<script >
export default {
	props: {
		sender: String,
		video: { type: String, required: true },
		userIsAuthor: Boolean,
	},
};
</script>

<template>
<li
	class="matrix-chat-message"
	:class="{'matrix-chat-message--author': userIsAuthor}">
	<div class="matrix-chat-message__container">
		<div class="matrix-chat-message__header">
			{{sender}}
		</div>
		<div class="matrix-chat-message__body">
			{{video}}
		</div>
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
			background: $color-pictonblue
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
.matrix-chat-message__container
	position: relative
	max-width: 25rem
	margin: $grid-space #{2 * $grid-space}
	padding: $grid-space
	border-radius: $border-radius
	border-top-left-radius: 0
	background: $color-white
	font-size: .8em
	&:hover
		background-color: $color-catskillwhite
		&::before
			border-top-color: $color-catskillwhite
	&::before
		position: absolute
		top: 0
		left: -$grid-space
		border-top: $grid-space solid $color-white
		border-bottom: $grid-space solid transparent
		border-left: $grid-space solid transparent
		content: ' '
.matrix-chat-message__header
	margin-bottom: $grid-space
	color: $color-aluminium-dark
.matrix-chat-message__body
	text-overflow: ellipsis
	overflow: hidden

</style>
