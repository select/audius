<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import draggable from 'vuedraggable';
import { slugify } from '../utils';


export default {
	components: {
		draggable,
	},
	props: {
		id: { type: String, required: true },
		room: { type: Object, required: true },
	},
	data() {
		return {
		};
	},
	methods: {
		...mapActions(['matrixSend', 'joinMatrixRoom', 'leaveMatrixRoom']),
		...mapMutations(['selectMediaSource', 'setShowMediumSettings']),
		dropAdd(event) { // Element is dropped into the list from another list
			const itemId = event.item.dataset.id;
			this.matrixSend({ roomId: this.id, itemId });
		},
	},
	computed: {
		...mapState(['playedMedia']),
		slugId() {
			return slugify(`matrix${this.id}`);
		},
	},
};
</script>

<template>
	<li class="a-mrt" :id="slugId">
		<div class="play-list-manager__drag-handle"></div>
		<draggable
			class="play-list-manager__tag-drop-zone"
			@add="dropAdd"
			:options="{
				sort: false,
				handle: '.no-handle',
				group: { name: 'lists' }
			}">
			<div
				class="play-list-manager__tag-body"
				@click="selectMediaSource({ type: 'matrix', id: id })">
				<div>
					{{room.name}}
				</div>
				<div class="matrix-room__tag-footer">
					<div> {{room.playList.filter(({id}) => !(id in playedMedia)).length}} New</div>
					<div> {{room.members ? room.members.length : '?'}} Members </div>
				</div>
			</div>
		</draggable>
		<div
			v-if="room.membership == 'invite'"
			class="play-list-manager__menu play-list-manager__invited">
			<span
				class="wmp-icon-check"
				title="join"
				@click="joinMatrixRoom({ id: room.roomId, name: room.name })"></span>
			<span
				class="wmp-icon-close"
				title="reject"
				@click="leaveMatrixRoom(room.roomId)"></span>
			</div>
		<div
			v-else
			class="play-list-manager__menu">
			<span
				class="wmp-icon-more_vert"
				title="Room settings"
				@click.stop="setShowMediumSettings({ medium: 'matrix', id })"></span>
		</div>
	</li>

</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'
.matrix-room__tag-footer
	display: flex
	div
		min-width: 4em
.a-mrt
	&:hover
		.play-list-manager__invited
			display: flex
.play-list-manager__invited.play-list-manager__invited
	justify-content: space-between
	width: 100%
	> span
		flex: 1
		&:hover
			background: $color-pictonblue
			color: $color-white
</style>



