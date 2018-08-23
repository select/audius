<script >
import { mapMutations, mapState, mapActions } from 'vuex';
import { mapModuleState } from '../utils';
import VideoItem from './video-item.vue';
import ChatMessage from './matrix-chat-message.vue';

const lastLength = {};
let hasSend = false;
export default {
	components: {
		VideoItem,
		ChatMessage,
	},
	data() {
		return {
			messageText: '',
		};
	},
	mounted() {
		this.$store.watch(state => state.matrix.chatLog, () => {
			const roomId = this.currentMediaSource.id;
			if (hasSend === true && this._chatLog.length !== lastLength[roomId]) {
				hasSend = false;
				this.$refs.chatLog.scrollTop = this.$refs.chatLog.scrollHeight;
				lastLength[roomId] = this._chatLog.length;
			}
		});
		const $playList = this.$el.querySelector('.play-list');
		$playList.addEventListener('scroll', () => {
			// Detect when scrolled to top.
			if ($playList.scrollTop === 0) {
				this.matrixLoadMore(this.currentMediaSource.id);
			}
		});
	},
	computed: {
		...mapState(['currentMediaSource', 'currentMedia', 'isPlaying', 'paginationIndex', 'isLoading']),
		...mapModuleState('matrix', ['chatLog', 'credentials', 'membersIndex', 'sources']),
		_chatLog() {
			return (this.chatLog[this.currentMediaSource.id] || []).filter(({ parentEvent }) => !parentEvent);
		},
	},
	methods: {
		...mapMutations(['setMainLeftTab']),
		...mapActions(['matrixLoadMore', 'matrixSendText']),
		send() {
			if (this.messageText) {
				this.matrixSendText({
					roomId: this.currentMediaSource.id,
					message: this.messageText,
				});
				hasSend = true;
				this.messageText = '';
			}
		},
	},

};
</script>

<template>
<div class="matrix-chat">
	<span
		@click="setMainLeftTab('playList')"
		class="wmp-icon-speaker_notes_off matrix-chat__off"></span>
	<div class="play-list media-list" ref="chatLog">
		<div
			class="play-list__greeting"
			v-if="!_chatLog || !_chatLog.length ">
			Nothing found. Click load more or add from search or playlists.
		</div>
		<div
			@click="matrixLoadMore(currentMediaSource.id)"
			class="play-list__load-more">
			… load more (Page {{paginationIndex[currentMediaSource.id] || 0}})
			<div class="loader" v-show="isLoading[currentMediaSource.id]"></div>
		</div>
		<ul>
			<component
				v-for="(event, index) in _chatLog"
				v-bind:is="event.type === 'text' ? 'chat-message' : 'video-item'"
				:userIsAuthor="event.sender === credentials.userId"
				:userIsAdmin="sources[this.currentMediaSource.id].isAdmin"
				:video="event"
				:membersIndex="membersIndex"
				:isPlaying="event.type !== 'text' && isPlaying && (currentMedia.id == event.id)"
				:key="index"></component>
		</ul>
	</div>
	<div class="matrix-chat__footer">
		<input
			type="text"
			placeholder="… your message"
			@keyup.enter="send"
			v-model="messageText">
		<span class="wmp-icon-send" @click="send"></span>
	</div>
</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.matrix-chat
	position: relative
	height: 100%
	padding-bottom: $touch-size-medium
	background-color: $color-athensgrey
	.play-list
		overflow: auto
	ul
		margin: 0
		padding: 0
		list-style: none
	.media-list__main
		background-color: $color-white
.matrix-chat__off
	position: absolute
	top: 0
	right: #{1.5 * $grid-space}
	cursor: pointer
	z-index: 1

.play-list__load-more
	min-height: $touch-size-medium
.matrix-chat__footer
	display: flex
	position: absolute
	bottom: 0
	left: 0
	align-items: center
	justify-content: space-between
	width: 100%
	height: $touch-size-medium
	padding-left: #{2 * $grid-space}
	background-color: $color-catskillwhite
	color: $color-aluminium-dark
	.wmp-icon-send
		cursor: pointer
	input
		flex: 1
		padding: 0 #{2 * $grid-space}
		font-size: 0.8rem

</style>
