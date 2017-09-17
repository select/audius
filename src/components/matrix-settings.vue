<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';

export default {
	computed: {
		...mapGetters(['youtubeApiKeyUI']),
		...mapState(['matrix', 'matrixRooms', 'currentMatrixRoom']),
		room() {
			return this.matrixRooms[this.currentMatrixRoom];
		},
		admin() {
			return this.room.members.filter(({ powerLevel }) => powerLevel >= 100);
		},
		speaker() {
			return this.room.members.filter(({ powerLevel }) => powerLevel >= 50 && powerLevel < 100);
		},
		listener() {
			return this.room.members.filter(({ powerLevel }) => powerLevel < 50);
		},
		myId() {
			return this.matrix.credentials.userId;
		},
	},
	methods: {
		...mapActions(['renameMatrixRoom']),
		...mapMutations(['updateWebScraper', 'addUrlPattern', 'renameWebScraper']),
	},
};
</script>

<template>
<div class="settings matrix-settings">
	<input
		@input="renameMatrixRoom({oldName: room.name, newName: $event.target.value})"
		type="text"
		placeholder="... name"
		v-bind:disabled="!room.isAdmin"
		v-bind:value="room.name">
	<div class="smaller row" v-if="!room.isAdmin"><b>You are not an admin</b>, you can not edit this room.</div>
	<h3>Members</h3>
	<h4>Admin</h4>
	<div class="row">
		<div v-for="member in admin" v-bind:class="{'matrix-settings__me' : member.id === myId}">
			{{member.id}}
		</div>
	</div>
	<h4 v-if="speaker.length">50+ Powers</h4>
	<div class="row">
		<div v-for="member in speaker" v-bind:class="{'matrix-settings__me' : member.id === myId}">
			{{member.id}}
		</div>
	</div>
	<h4>Other</h4>
	<div class="row">
		<div v-for="member in listener" v-bind:class="{'matrix-settings__me' : member.id === myId}">
			{{member.id}}
		</div>
	</div>
	<h3>Options</h3>
	<div class="row">
		<div>
			<input v-bind:disabled="!room.isAdmin" type="checkbox" id="private-room"><label for="private-room"></label>
			Hidden
			<span class="smaller">Not publicly listed</span>
		</div>
		<div>
			<input v-bind:disabled="!room.isAdmin" type="checkbox" id="private-room"><label for="private-room"></label>
			Private
			<span class="smaller">New users need to be approved</span>
		</div>
		<div>
			<input v-bind:disabled="!room.isAdmin" type="checkbox" id="human-read"><label for="human-read"></label>
			Post human readable links
		</div>
		<div>
			<input v-bind:disabled="!room.isAdmin" type="checkbox" id="can-post"><label for="can-post"></label>
			Restricted posting
			<span class="smaller">Only 50+ power users are allowed to post</span>
		</div>
	</div>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'
.settings.matrix-settings
	overflow: hidden
	.row, h3, h4, input
		padding: 0 $grid-space
	input[type="text"]
		font-size: 1.5rem
		height: $touch-size-huge
		width: 100%
		border: 0
		margin-bottom: $grid-space
.matrix-settings__me
	color: $color-pictonblue
</style>
