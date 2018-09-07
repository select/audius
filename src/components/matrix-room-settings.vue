<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';

import { mapModuleState, debounce } from '../utils';

export default {
	data() {
		return {
			showConfirmDelte: false,
		};
	},
	computed: {
		...mapGetters(['youtubeApiKeyUI']),
		...mapState(['currentMediaSource']),
		...mapModuleState('matrix', ['credentials', 'sources', 'membersIndex']),
		currentMatrixRoom() {
			return this.currentMediaSource.type === 'matrix' ? this.currentMediaSource.id : null;
		},
		room() {
			return this.sources[this.currentMediaSource.id];
		},
		members() {
			if (!this.room.members) return [];
			return this.room.members.map(member => Object.assign(
				{},
				member,
				this.membersIndex[member.id] || { name: member.id, nameColor: '' }
			));
		},
		admin() {
			return this.members.filter(({ powerLevel }) => powerLevel >= 100);
		},
		speaker() {
			return this.members.filter(({ powerLevel }) => powerLevel >= 50 && powerLevel < 100);
		},
		listener() {
			return this.members.filter(({ powerLevel }) => powerLevel < 50);
		},
		myId() {
			return this.credentials.userId;
		},

	},
	methods: {
		...mapActions(['setRoomName', 'updateRoomOptions', 'setRoomTag', 'leaveMatrixRoom']),
		...mapMutations(['toggleHideRoom']),
		_setRoomName: debounce(function debouncedSetName(id, name) {
			this.setRoomName({ id, name });
		}, 1000),
		_inviteUser() {
			// TODO
		},
	},
};
</script>

<template>
<div class="settings matrix-settings">
	<div class="matrix-settings__hidden-icon">
		<div
			@click="toggleHideRoom(currentMediaSource.id)"
			:class="room.hidden ? 'wmp-icon-visibility_off' : 'wmp-icon-visibility'"></div>
		<div
			class="wmp-icon-close"
			title="Leave room"
			@click="showConfirmDelte = currentMediaSource.id"></div>
	</div>

	<input
		@input="_setRoomName(currentMatrixRoom, $event.target.value)"
		type="text"
		class="matrix-settings__name"
		placeholder="… name"
		v-bind:disabled="!room.isAdmin"
		:value="room.name">
	<div class="row">
		<a v-bind:href="'https://matrix.to/#/'+room.alias" target="_blank" rel="noopener">{{room.alias}}</a>
	</div>
	<div class="spacer"></div>
	<div class="smaller row" v-if="!room.isAdmin"><b>You are not an admin</b>, you can not edit this room.</div>
	<h3>{{room.members.length}} Members</h3>
	<h4>Admin</h4>
	<div class="matrix-settings__members">
		<div
			v-for="member in admin"
			v-bind:class="{'matrix-settings__me' : member.id === myId}"
			v-bind:style="{ color: member.nameColor }"
			:title="member.id">
			{{member.name}}
		</div>
	</div>
	<h4 v-if="speaker.length">50+ Powers</h4>
	<div class="matrix-settings__members">
		<div
			v-for="member in speaker"
			v-bind:class="{'matrix-settings__me' : member.id === myId}"
			v-bind:style="{ color: member.nameColor }"
			:title="member.id">
			{{member.name}}
		</div>
	</div>
	<h4>Other</h4>
	<div class="matrix-settings__members">
		<div
			v-for="member in listener"
			v-bind:class="{'matrix-settings__me' : member.id === myId}"
			v-bind:style="{ color: member.nameColor }"
			:title="member.id">
			{{member.name}}
		</div>
	</div>
	<!-- <h4>Invite</h4>
	<ul class="input-list">
		<li v-for="userId in []">
			{{userId}}
		</li>
		<li>
			<input class="input-list__input" type="text" placeholder="… @user-name:matrix.org">
			<span class="wmp-icon-add" @click="_inviteUser"></span>
		</li>
	</ul> -->
	<h3>Options</h3>
	<div class="row">
		<div>
			<input
				type="checkbox"
				v-bind:disabled="!room.isAdmin"
				v-bind:checked="room.isHidden"
				@change="updateRoomOptions({id: currentMatrixRoom, isHidden: $event.target.checked})"
				id="hidden-room"><label for="hidden-room"></label>
			Hidden
			<span class="smaller">Not publicly listed</span>
		</div>
		<div>
			<input
				type="checkbox"
				v-bind:disabled="!room.isAdmin"
				v-bind:checked="room.allowGuests"
				@change="updateRoomOptions({id: currentMatrixRoom, allowGuests: $event.target.checked})"
				id="allow-guests"><label for="allow-guests"></label>
			Allow guests to join
		</div>
		<!-- <div>
			<input
				type="checkbox"
				v-bind:disabled="!room.isAdmin"
				@change="updateRoomOptions({id: currentMatrixRoom, private: $event.target.checked})"
				id="private-room"><label for="private-room"></label>
			Private
			<span class="smaller">New users need to be approved</span>
		</div>
		<div>
			<input
				v-bind:disabled="!room.isAdmin"
				type="checkbox"
				@change="updateRoomOptions({id: currentMatrixRoom, restrictPosting: $event.target.checked})"
				id="restrict-post"><label for="restrict-post"></label>
			Restricted posting
			<span class="smaller">Only 50+ power users are allowed to post</span>
		</div> -->
	</div>
	<div class="modal" v-if="showConfirmDelte" @click="showConfirmDelte = false">
			<div class="modal__body" @click.stop>
				Are you sure you want to leave the room?
				<div class="modal__btn-group">
					<button class="button" @click="showConfirmDelte = false">Cancel</button>
					<button class="button btn--blue" @click.stop="leaveMatrixRoom(showConfirmDelte);showConfirmDelte = false;">Leave</button>
				</div>
			</div>
		</div>
</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'
.settings.matrix-settings
	position: relative
	overflow: hidden
	.row, h3, h4, .matrix-settings__name
		padding: 0 $grid-space
	.matrix-settings__name
		font-size: 1.5rem
		height: $touch-size-huge
		width: 100%
		margin-bottom: $grid-space
	.spacer
		height: #{2 * $grid-space}
.matrix-settings__me
	background-color: $color-pictonblue
	color: $color-white!important
	&:hover
		color: inherit!important
.matrix-settings__hidden-icon
	position: absolute
	top: 0
	right: 0
	cursor: pointer
.matrix-settings__members
	> div
		display: flex
		align-items: center
		height: $touch-size-small
		padding: #{2 * $grid-space}
		&:hover
			background: $color-catskillwhite

</style>
