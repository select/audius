<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';

import { mapModuleState } from '../utils';

export default {
	data() {
		return {
			showConfirmDelte: false,
			copyActive: false,
			showInvite: false,
			inviteQuery: '',
		};
	},
	computed: {
		...mapGetters(['youtubeApiKeyUI']),
		...mapState(['currentMediaSource']),
		...mapModuleState('matrix', ['credentials', 'sources', 'membersIndex', 'broadcastRoom', 'sendBroadcast']),
		currentMatrixRoom() {
			return this.currentMediaSource.type === 'matrix' ? this.currentMediaSource.id : null;
		},
		room() {
			return this.broadcastRoom;
		},
		roomMemberIndex() {
			return new Set(this.room.members.map(({ id }) => id));
		},
		members() {
			if (!this.room.members) return [];
			return this.room.members.map(member => Object.assign(
				{},
				member,
				this.membersIndex[member.id] || { name: member.id, nameColor: '' }
			));
		},
		membersByType() {
			return {
				admin: this.members.filter(({ powerLevel }) => powerLevel >= 100),
				moderator: this.members.filter(({ powerLevel }) => powerLevel >= 50 && powerLevel < 100),
				other: this.members.filter(({ powerLevel }) => powerLevel < 50),
			};
		},
		myId() {
			return this.credentials.userId;
		},
		_inviteUserList() {
			if (!this.inviteQuery) return [];
			return Object.values(this.membersIndex).filter(({ userId, name }) => !this.roomMemberIndex.has(userId) && `${userId}${name}`.includes(this.inviteQuery));
		},
	},
	methods: {
		...mapActions(['updateRoomOptions', 'leaveMatrixRoom', 'inviteToMatrixRoom', 'directMessage']),
		...mapMutations(['selectMediaSource', 'setSendBroadcast']),
		copyToClip() {
			window.getSelection().removeAllRanges();
			const tmpEl = document.createElement('div');
			tmpEl.innerHTML = `${window.location.href}?import=${this.currentMediaSource.id}&type=${this.currentMediaSource.type}&title=${encodeURIComponent(this.room.name)}`;
			document.body.appendChild(tmpEl);

			const range = document.createRange();
			range.selectNode(tmpEl);
			window.getSelection().addRange(range);

			try {
				document.execCommand('copy');
				this.copyActive = true;
				setTimeout(() => {
					this.copyActive = false;
				}, 800);
			} catch (error) {
				this.error(`Could not copy to clipboard. ${error}`);
			}
			window.getSelection().removeAllRanges();
			tmpEl.parentNode.removeChild(tmpEl);
		},
	},
};
</script>

<template>
<div class="matrix-settings__message" v-if="room.membership === 'not avialable'">
	Your stations is not created yet.
</div>
<div class="matrix-settings__message" v-else-if="room.membership === 'pending'">
	Creating your broadcast …
</div>
<div
	v-else
	class="settings matrix-settings">
	<div class="matrix-settings__header">
		<h1>Broadcast your music</h1>
	</div>
	<div class="row matrix-settings__aliases">
		<a
			v-for="alias in room.aliases"
			v-bind:href="'https://matrix.to/#/'+alias"
			target="_blank"
			rel="noopener">{{alias}}</a>
	</div>
	<div class="spacer"></div>
	<div class="matrix-settings__actions">
		<button
			:class="{'matrix-settings--live': sendBroadcast}"
			class="button btn--grey-ghost"
			v-bind:class="{ active: copyActive }"
			@click="setSendBroadcast()">
			<span class="wmp-icon-cast"></span>
			live
		</button>
		<button
			class="button btn--grey-ghost"
			v-bind:class="{ active: copyActive }"
			@click="copyToClip">
			<span class="wmp-icon-share"></span>
			copy invite link
		</button>

	</div>
	<div class="spacer"></div>
	<div class="smaller row" v-if="!room.isAdmin"><b>You are not an admin</b>, you can not edit this room.</div>
	<div class="spacer"></div>
	<div class="matrix-settings__members_header">
		<h3>{{room.members.length}} Members</h3>
		<span
			class="wmp-icon-add_circle"
			title="add a user"
			@click="showInvite = !showInvite"></span>
	</div>
	<div v-if="showInvite">
		<h4>Invite</h4>
		<div class="matrix-settings__invite-in">
			<input
				v-model="inviteQuery"
				type="text"
				placeholder="... user name, email, telephone">
			<span class="wmp-icon-search"></span>
		</div>
		<div class="matrix-settings__members">
			<div
				v-for="user in _inviteUserList"
				@click="inviteToMatrixRoom({ userId: user.userId, roomId: room.roomId }); inviteQuery = '';"
				:title="user.userId">
				<span v-bind:style="{ color: user.nameColor }"> {{user.name}} </span>
				<div>
					invite
					<div class="wmp-icon-add"></div>
				</div>
			</div>
			<div v-if="!_inviteUserList.length"> ... nothing found</div>
		</div>
	</div>
	<div
		v-for="type in ['admin', 'moderator', 'other']"
		v-if="membersByType[type].length">
		<h4>{{type}}s</h4>
		<div class="matrix-settings__members">
			<div
				v-for="member in membersByType[type]"
				v-bind:class="{'matrix-settings--me' : member.id === myId}"
				@click="directMessage(member.id)"
				:title="member.id">
				<span
					v-bind:style="{ color: member.nameColor }">
					{{member.name || member.id}}</span>
				<div>
					<span
						title="Send direct message"
						class="wmp-icon-chat"></span>
				</div>
			</div>
		</div>
	</div>
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
		width: 100%
		height: $touch-size-huge
		margin-bottom: $grid-space
		font-size: 1.5rem
	h4
		text-transform: capitalize
.matrix-settings__header
	margin-left: $grid-space
.matrix-settings__logo
	width: $touch-size-medium
	min-width: $touch-size-medium
	height: $touch-size-medium
	min-height: $touch-size-medium
	margin: 0 #{2 * $grid-space}
	border-radius: 50%
	background-repeat: no-repeat
	background-position: center
	background-size: contain
.matrix-settings__aliases
	display: flex
	flex-direction: column
.matrix-settings__members_header
	display: flex
	align-items: center
	> span
		transition: color $transition-time
		color: $color-aluminium
		cursor: pointer
		&:hover
			color: $color-pictonblue
.matrix-settings__actions
	padding: 0 $grid-space
	button
		margin-bottom: $grid-space
	span
		margin-right: $grid-space
	.active
		background: $color-larioja
		color: $color-white
.matrix-settings__invite-in
	display: flex
	align-items: center
	padding: 0 $grid-space
	background: $color-catskillwhite
	input
		flex: 1
		background: transparent
	span
		color: $color-aluminium
.matrix-settings__members
	> div
		display: flex
		justify-content: space-between
		height: $touch-size-small
		padding: #{2 * $grid-space}
		cursor: pointer
		> div
			display: none
			align-items: center
			color: $color-aluminium
		&:hover
			background: $color-catskillwhite
			> div
				display: flex
		&.matrix-settings--me
			background-color: $color-pictonblue
			cursor: default
			span
				color: $color-white!important
			&:hover
				color: inherit
				> div
					display: none

.button.matrix-settings--live
	border-color: $color-monza
	color: $color-monza
.matrix-settings__message
	display: flex
	justify-content: center
	padding: #{2 * $grid-space}
	font-size: 1.5rem
</style>
