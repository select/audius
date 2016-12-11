<script>
import WebHeader from './web-header.vue';
import MainRight from './main-right.vue';
import PlayListManager from './play-list-manager.vue';
import PlayList from './play-list.vue';


export default {
	name: 'web-app',
	components: {
		WebHeader,
		MainRight,
		PlayListManager,
		PlayList,
	},
};
</script>

<template>
<div class="web-app">
	<web-header></web-header>
	<main class="box">
		<play-list-manager></play-list-manager>
		<play-list></play-list>
		<main-right></main-right>
	</main>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.web-app
	width: 100%
	height: 100%
	overflow: hidden
	display: flex
	flex-direction: column

main.box
	flex: 1
	display: flex
	> div:not(:first-child)
		flex: 2
		overflow: hidden
		&:not(:last-child)
			border-right: 1px solid $color-aluminium

</style>
