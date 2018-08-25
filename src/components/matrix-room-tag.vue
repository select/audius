<script>
import { mapMutations, mapActions, mapState } from 'vuex';
import draggable from 'vuedraggable';


export default {
	components: {
		draggable,
	},
	props: {
		id: { type: String, required: true },
		room: { type: Object, required: true },
		element: { type: String, required: true },
		childElement: String,
	},
	data() {
		return {
		};
	},
	methods: {
		...mapActions(['matrixSend']),
		...mapMutations(['selectMediaSource', 'setShowMediumSettings']),
		dropAdd(event) { // Element is dropped into the list from another list
			const itemId = event.item.dataset.id;
			this.matrixSend({ roomId: this.id, itemId });
		},
	},
	computed: {
		...mapState(['playedMedia']),
	},
};
</script>

<template>
	<component
		v-bind:is="element"
		:options="{
			sort: false,
			handle: '.no-handle',
			group: { name: 'lists' }
		}"
		class="play-list-manager__tag-drop-zone"
		@add="dropAdd($event)"
		:element="childElement">
		<div class="play-list-manager__drag-handle"></div>
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
		<div class="play-list-manager__menu">
			<span
				class="wmp-icon-more_vert"
				title="Room settings"
				@click.stop="setShowMediumSettings({ medium: 'matrix', id })"></span>
		</div>
	</component>

</template>

<style lang="sass">

.matrix-room__tag-footer
	display: flex
	div
		min-width: 4em

</style>



