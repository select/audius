<script>
import Vue from 'vue/dist/vue';
import store from '../store';
import Actions from '../actions';
import { debounce } from '../utils/debounce';

export default {
	name: 'play-list-manager',
	data() {
		return {
			state: store.getState(),
			store,
			Actions,
		};
	},
	created() {
		this.unsubscribe = store.subscribe(() => {
			this.state = store.getState();
		});
	},
	beforeDestroy() {
		this.unsubscribe();
	},
	methods: {
		addTags() {
			const el = document.querySelector('.play-list-manager__input input');
			store.dispatch(Actions.addTags(el.value));
			el.value = '';
		},
		selectPlayList(name) {
			store.dispatch(Actions.selectPlayList(name));
		},
		deletePlayList(name, event) {
			event.stopPropagation();
			store.dispatch(Actions.deletePlayList(name));
		},
		togglePlayLists() {
			store.dispatch(Actions.togglePlayLists());
		},
		toggleEditPlayList(name, event) {
			event.stopPropagation();
			store.dispatch(Actions.toggleEditPlayList(name, true));
		},
		renamePlayList: debounce((oldName, event) => {
			store.dispatch(Actions.renamePlayList(oldName, event.target.value));
		}, 500),
	},
	computed: {
		tags() {
			return Object.keys(this.state.mediaPlayer.tags).map(key => ({ name: key, playList: this.state.mediaPlayer.tags[key] }));
		},
	},
};
</script>

<template>
<div
	class="play-list-manager"
	v-bind:class="{ active: state.website.showPlayLists }">
	<div class="nav-handle" title="Playlists" v-on:click="togglePlayLists">
		<div class="nav-handle__tab"></div>
		<span class="wmp-icon-queue_music"></span>
	</div>
	<ul>
		<li
			v-bind:class="{ active: !state.mediaPlayer.currentPlayList }"
			v-on:click="selectPlayList()">
			<div class="play-list-manager__tag-body">
				<div>History</div>
				<div>{{state.mediaPlayer.playList.length}} Songs</div>
			</div>
		</li>
		<li class="spacer"></li>
		<li
			v-for="tag in tags"
			v-bind:class="{ active: state.mediaPlayer.currentPlayList == tag.name }"
			v-on:click="selectPlayList(tag.name)">
			<div class="play-list-manager__tag-body">
				<div v-show="state.mediaPlayer.currentPlayList != tag.name">{{tag.name}}</div>
				<div v-show="state.mediaPlayer.currentPlayList == tag.name">
					<input
						class="play-list-manager__tag-name-input"
						type="text"
						v-bind:value="tag.name"
						v-on:input="renamePlayList(tag.name, $event)"
						placeholder="... playlist name">
				</div>
				<div>{{tag.playList.length}} Songs</div>
			</div>
			<div class="play-list-manager__menu">
				<span
					class="wmp-icon-close"
					title="Delte playlist"
					v-on:click="deletePlayList(tag.name, $event)"></span>
			</div>
		</li>
		<li class="play-list-manager__input">
			<input
				v-on:keyup.enter="addTags"
				type="text"
				placeholder="... new playlist">
			<span class="wmp-icon-add" v-on:click="addTags"></span>
		</li>
	</ul>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.play-list-manager
	position: relative
	width: 25vw
	margin-left: -24.5vw
	transition: all $transition-time
	background: $color-aluminium-dark
	border-right: 1px solid $color-aluminium
	&.active
		margin-left: 0
	ul
		padding: 0
		list-style: none
		height: 100%
		overflow-y: auto
		margin: 0

		li
			display: flex
			height: $touch-size-medium
			margin: $grid-space
			border-radius: $border-radius
			align-items: center
			padding-left: #{2*$grid-space}
			// border: 1px solid $color-mineshaft
			background: $color-athensgrey
			color: $color-palesky
			cursor: pointer
			// font-weight: bold
			&.active
				border-left: 1vw solid $color-pictonblue
				font-weight: bold
				padding-left: 1vw
				background: $color-white

			// &.active,
			&:hover:not(.spacer)
				border-color: $color-pictonblue
				color: $color-pictonblue
				background: $color-white
				.play-list-manager__menu
					display: block
				input
					color: $color-pictonblue
			.play-list-manager__menu
				display: none
			.wmp-icon-mode_edit:before
				font-size: 1.5em
			.play-list-manager__tag-body
				display: flex
				flex-direction: column
				div:last-child
					font-size: 0.7em
				input
					font-size: 1em
					border: 0
					color: $color-palesky
			*:first-child
				flex: 1
				text-overflow: ellipsis
				white-space: nowrap
				overflow: hidden

		.spacer
			background: transparent
			height: $grid-space
		.play-list-manager__input
			padding: 0
			background: $color-athensgrey
			input
				background: transparent
				box-sizing: border-box
				border: 0
				border-radius: $border-radius
				height: 100%
				width: 100%
				padding-left: #{2*$grid-space}
				font-size: 1em
				+placeholder
					color: $color-palesky
		&::-webkit-scrollbar-thumb
		  background: $color-athensgrey
		&::-webkit-scrollbar-track
  		background: $color-aluminium-dark
.nav-handle
	position: absolute
	top: calc(50% - #{$touch-size-small/2})
	right: -2em
	cursor: pointer
	&:hover
		span
			color: $color-aluminium-dark
		.nav-handle__tab
			background: $color-catskillwhite

	.nav-handle__tab
		height: 2em
		width: 2.5em
		position: absolute
		top: 0.1em
		left: 0
		transform: rotate(90deg) perspective(2em) rotateX(30deg)
		background: $color-aluminium-dark
		border: 1px solid $color-aluminium
		border-bottom: 0
	span
		color: $color-catskillwhite
		width: $touch-size-small
		height: $touch-size-small
</style>



