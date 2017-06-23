<script>
import WebHeader from './web-header.vue';
import MainRight from './main-right.vue';
import PlayList from './play-list.vue';
import LeftMenu from './left-menu.vue';
import ImportModal from './import-modal.vue';

export default {
	components: {
		WebHeader,
		MainRight,
		LeftMenu,
		PlayList,
		ImportModal,
	},
};
</script>

<template>
<div class="web-app">
	<web-header></web-header>
	<main class="box">
		<left-menu></left-menu>
		<play-list></play-list>
		<main-right></main-right>
	</main>
	<import-modal></import-modal>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/font'
@import '../sass/vars'
@import '../sass/card'
@import '../sass/color'
@import '../sass/input'
@import '../sass/icon'
@import '../sass/modal'

@import '../sass/media-list'

body,
html,
	margin: 0
	padding: 0
	height: 100%
body
	font-family: 'Nobile', sans-serif
	font-size: 2.3vmin
	display: flex
	flex-direction: column
	align-items: center
	color: $color-tuna
	margin: 0
	a
		color: $color-tuna
		&:visited
			color: $color-tuna
	input:focus
		outline: 0
	::-webkit-scrollbar
		width: 9px
		&:hover
			width: 10px

	::-webkit-scrollbar-track
		background: $color-catskillwhite

	::-webkit-scrollbar-thumb
		background: $color-aluminium-dark

.box-1-1
	display: flex
	>div
		flex: 1
		overflow-x: auto


#app
	position: absolute
	top: 0
	left: 0
	width: 100%
	height: 100%

.web-app
	width: 100%
	height: 100%
	overflow: hidden
	display: flex
	flex-direction: column

main.box
	flex: 1
	display: flex
	height: 100%
	overflow: hidden
	> div:not(:first-child)
		flex: 2
		overflow: hidden
		&:not(:last-child)
			border-right: 1px solid $color-aluminium

</style>
