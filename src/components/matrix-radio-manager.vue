<script>
import { mapMutations, mapState, mapActions } from 'vuex';

export default {
	methods: {
		...mapMutations(['selectMediaSource', 'moveRadioStationsOrderd']),
		...mapActions(['joinRadioStation', 'leaveRadioStation']),
		addRadioStation() {
			const el = document.querySelector('.matrix-radio__input input');
			this.joinRadioStation(el.value);
			el.value = '';
		},
	},
	computed: {
		...mapState(['matrixRooms', 'currentRadioStation', 'radioStationsOrderd', 'radioStations']),
	},
};
</script>

<template>
<div class="matrix-radio">
	<ul class="matrix-radio__tags">
		<li
			v-for="roomId in radioStationsOrderd"
			v-bind:data-name="radioStations[roomId].name"
			v-bind:class="{ active: currentRadioStation == roomId }"
			@click="selectMediaSource({type:'radio', id:roomId})">
			<div class="matrix-radio__drag-handle"></div>
			<div class="matrix-radio__tag-body">
				<div>{{radioStations[roomId].name}}</div>
			</div>
			<div class="matrix-radio__menu">
				<span
					class="wmp-icon-close"
					title="Delte playlist"
					@click.stop="leaveRadioStation(roomId)"></span>
			</div>
		</li>
		<li class="play-list-manager__input">
			<input
				v-on:keyup.enter="addRadioStation"
				type="text"
				placeholder="... matrix.org room">
			<span class="wmp-icon-add" @click="addRadioStation"></span>
		</li>
	</ul>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'

.matrix-radio
	flex: 1
	overflow-y: auto
	&::-webkit-scrollbar-thumb
	  background: $color-athensgrey
	&::-webkit-scrollbar-track
		background: $color-aluminium-dark
	ul
		padding: 0
		list-style: none
		margin: 0
		li
			display: flex
			height: $touch-size-medium
			margin: $grid-space
			border-radius: $border-radius
			align-items: center
			background: $color-athensgrey
			color: $color-palesky
			cursor: pointer
			&.active
				font-weight: bold
				background: $color-white
				.matrix-radio__drag-handle
					border-left: 1vw solid $color-pictonblue

			&:hover:not(.spacer)
				border-color: $color-pictonblue
				color: $color-pictonblue
				background: $color-white
				.matrix-radio__menu
					display: block
				input
					color: $color-pictonblue

		.spacer
			background: transparent
			height: $grid-space

.matrix-radio__tag-body
	flex: 1
	text-overflow: ellipsis
	white-space: nowrap
	overflow: hidden

.matrix-radio__drag-handle
	width: #{2*$grid-space}
	height: 100%
	&:not(.matrix-radio--default)
		cursor: move
.matrix-radio__menu
	display: none

</style>



