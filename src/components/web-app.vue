<script>
import { mapState } from 'vuex';
import WebHeader from './web-header.vue';
import MainRight from './main-right.vue';
import PlayList from './play-list.vue';
import LeftMenu from './left-menu.vue';
import Messages from './messages.vue';
import WebAppMobile from './web-app-mobile.vue';

const ImportModal = () => import(/* webpackChunkName: "components/import-modal" */'./import-modal.vue');

export default {
	components: {
		WebHeader,
		MainRight,
		LeftMenu,
		PlayList,
		ImportModal,
		Messages,
		WebAppMobile,
	},
	computed: mapState(['isMobile', 'pendingImportURL']),
};
</script>

<template>
<div class="web-app" id="audius-website">
	<div v-if="!isMobile" class="web-app__desktop">
		<web-header></web-header>
		<main class="box">
			<left-menu></left-menu>
			<div class="web-app__main">
				<play-list></play-list>
				<main-right></main-right>
			</div>
		</main>
	</div>

	<web-app-mobile v-if="isMobile"></web-app-mobile>
	<import-modal v-if="pendingImportURL"></import-modal>
	<messages></messages>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'
@import '../sass/font'

@import '../sass/card'
@import '../sass/input'
@import '../sass/icon'
@import '../sass/modal'
@import '../sass/tabs'
@import '../sass/global'

@import '../sass/media-list'

*
	box-sizing: border-box

body,
html,
	margin: 0
	padding: 0
	height: 100%

body
	font-family: 'Nobile', sans-serif
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
		width: #{1.2 * $grid-space}
	::-webkit-scrollbar-track
		background: $color-catskillwhite

	::-webkit-scrollbar-thumb
		background: $color-aluminium-dark

.web-app
	width: 100%
	height: 100%
	overflow: hidden
	display: flex
	flex-direction: column
.web-app__desktop
	flex: 1
	overflow: hidden
	display: flex
	flex-direction: column

main.box
	flex: 1
	display: flex
	height: 100%
	overflow: hidden
.web-app__main
	flex: 1
	display: flex
	overflow: hidden
	>div
		overflow: hidden
		&:first-child
			flex: 1
			border-right: 1px solid $color-aluminium
</style>
