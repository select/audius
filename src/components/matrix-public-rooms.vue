<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { mapModuleState } from '../utils';

const roomsList = [
	{ id: '!vginOAdNcoiesrilGC:matrix.org', name: 'Music Links' },
	{ id: '!zKinTrtpQEyHfnIbnI:matrix.org', name: 'Random' },
	{ id: '!doxyJrwhqLPtPKawfE:matrix.org', name: '😁😄😅😆😆 wtf' },
	{ id: '!sgKmJzakMmEdSCgKCE:matrix.org', name: 'Electronic' },
	{ id: '!VTIhlnDdHsxZFZQNFh:matrix.org', name: 'Rock' },
	{ id: '!aSJNcnulrVagkddEtD:matrix.org', name: 'Chillout ' },
	{ id: '!wkEBtQpMVXqZktQwjF:matrix.org', name: 'Docu / Tech / Science [Audius]' },
	// { id: '!uFhErnfpYhhlauJsNK:matrix.org', name: 'Music Discovery' },
];

export default {
	methods: {
		...mapActions(['updatePublicRooms', 'joinMatrixRoom', 'searchRoom']),
		...mapMutations(['toggleMatrixRoomDirectory']),
		close() {
			this.toggleMatrixRoomDirectory(false);
		},
		_searchRoom() {
			const query = this.$refs.query.value;
			if (!query) return;
			this.searchRoom(query);
			// this.$refs.query.value = '';
		},
	},
	computed: {
		...mapState(['isLoading']),
		...mapModuleState('matrix', ['sources', 'sourcesOrdered', 'showMatrixRoomDirectory', 'publicRooms', 'roomSearchResults']),
		filteredPublicRooms() {
			return (this.publicRooms || roomsList).filter(({ id }) => !(this.sourcesOrdered.includes(id)));
		},
	},
};
</script>

<template>
	<div v-if="showMatrixRoomDirectory">
		<div
			@click="close"
			class="modal a-mpr">
			<div class="modal__body" @click.stop>
				<h3>Public rooms</h3>
				<div class="a-mpr__filteredPublicRooms">
					<a
						class="button btn--blue"
						v-for="room in filteredPublicRooms"
						v-bind:title="'['+room.numberOfMembers+' Members] '+room.topic"
						@click="joinMatrixRoom({ id: room.id, name: room.name })">
						{{room.name}}
					</a>
					<button
						v-if="filteredPublicRooms.length"
						class="button btn--blue-ghost"
						@click="updatePublicRooms">
						<div class="loader" v-show="isLoading['updatePublicRooms']"></div>
						update room list
					</button>
				</div>
				<div class="a-mpr__search">
					<input
						type="text"
						placeholder="… search rooms"
						ref="query"
						@keyup.enter="_searchRoom">
						<div class="loader" v-show="isLoading['searchRoom']"></div>
						<span
							v-show="!isLoading['searchRoom']"
							class="wmp-icon-search"
							@click="_searchRoom"></span>
				</div>
				<div class="a-mpr__search-results">
					<div
						v-for="room in roomSearchResults"
						:class="{'a-mpr--active': sources[room.room_id]}"
						@click="joinMatrixRoom({ id: room.room_id, name: room.name })">
						<div class="a-mpr__title">
							<div>
								<b>{{room.name}}</b>
								<span class="smaller">{{!room.guest_can_join ? 'no guests' : ''}}</span>
							</div>
							<span class="smaller">{{room.num_joined_members}} Members</span>
						</div>
						<div class="smaller a-mpr__topic">{{room.topic}}</div>
						<div class="a-mpr__menu">Join <span class="wmp-icon-add"></span></div>
					</div>
				</div>
				<div class="a-mpr__footer">
					<button class="button" @click="close">Cancel</button>
					<div class="smaller">...</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.matrix-create
	input
		width: 100%
		margin-bottom: $grid-space
.a-mpr
	h3
		padding: #{2 * $grid-space} #{2 * $grid-space} 0 #{2 * $grid-space}
	.modal__body
		display: flex
		flex-direction: column
		max-height: 80%
		padding: 0
		overflow: hidden
.a-mpr__footer
	display: flex
	justify-content: space-between
	align-items: center
	min-height: $touch-size-huge
	padding: #{2 * $grid-space}
.a-mpr__filteredPublicRooms
	display: flex
	flex-wrap: wrap
	overflow: hidden
	padding: 0 #{2 * $grid-space}
	flex: 1
	>*
		margin: 0 $grid-space $grid-space 0
.a-mpr__search
	display: flex
	justify-content: space-between
	min-height: $touch-size-medium
	margin: 0 #{2 * $grid-space}
	background-color: $color-catskillwhite
	[class^='wmp-icon-']
		cursor: pointer
	input
		flex: 1
		height: $touch-size-medium
		padding: $grid-space
		background-color: $color-catskillwhite
.a-mpr__search-results
	flex: 1
	overflow-y: auto
	> div
		position: relative
		align-items: center
		height: $touch-size-huge
		padding-left: #{2 * $grid-space}
		overflow-x: hidden
		cursor: pointer
		&:hover
			background: $color-catskillwhite
			.a-mpr__menu
				display: flex
		&.a-mpr--active
			background-color: $color-pictonblue
			color: $color-white
			.a-mpr__menu
				display: none
.a-mpr__topic
	padding-top: $grid-space
	text-overflow: ellipsis
	white-space: nowrap
.a-mpr__title
	display: flex
	justify-content: space-between
	padding: #{2 * $grid-space} #{2 * $grid-space} 0 0
	white-space: nowrap
	> *:first-child
		text-overflow: ellipsis
		overflow: hidden
.a-mpr__menu
	display: none
	position: absolute
	top: 0
	right: 0
	align-items: center
	height:  $touch-size-huge
	padding: 0 #{2 * $grid-space}
	background-color: rgba(239, 241, 247, .75)

</style>
