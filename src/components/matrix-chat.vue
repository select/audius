<script >
import Vue from 'vue';
import { mapMutations, mapState, mapActions } from 'vuex';
import { mapModuleState } from '../utils';
import VideoItem from './video-item.vue';
import ChatMessage from './matrix-chat-message.vue';

let latestCreatedAt = null;
let lastHeight = 0;
let scrollDown = false;
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
	beforeUpdate() {
		const $chat = this.$refs.chat;
		scrollDown = ($chat.scrollHeight - $chat.scrollTop - $chat.offsetHeight - 100) < 0;
	},
	mounted() {
		const _chatLog = this.chatLog[this.currentMediaSource.id] || [];
		latestCreatedAt = _chatLog.length && _chatLog[_chatLog.length - 1].createdAt;
		lastHeight = this.$refs.chat.offsetHeight;
		const $chat = this.$refs.chat;
		Vue.nextTick(() => {
			this.$refs.chat.scrollTo(0, $chat.scrollHeight);
		});
		this.$store.watch(state => state.matrix.chatLog, () => {
			const chatLog = this.chatLog[this.currentMediaSource.id];
			const { createdAt, sender } = chatLog[chatLog.length - 1];
			if (latestCreatedAt !== createdAt) {
				Vue.nextTick(() => {
					if (scrollDown || sender === this.credentials.userId) {
						$chat.scrollTo({
							behavior: 'smooth',
							top: $chat.scrollHeight,
						});
						lastHeight = $chat.scrollHeight;
					}
				});
			} else {
				Vue.nextTick(() => {
					const { scrollHeight } = $chat;
					const diff = scrollHeight - lastHeight;
					$chat.scrollTop = diff;
					setTimeout(() => {
						lastHeight = scrollHeight;
					}, 200);
				});
			}
			latestCreatedAt = createdAt;
		});
		const $playList = this.$el.querySelector('.play-list');
		$playList.addEventListener('wheel', () => {
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
				this.messageText = '';
			}
		},
	},

};
</script>

<template>
<div class="matrix-chat">
	<div class="play-list media-list" ref="chat">
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
		<ul ref="list">
			<component
				v-for="(event, index) in _chatLog"
				v-bind:is="event.type === 'text' ? 'chat-message' : 'video-item'"
				:isAuthor="event.sender === credentials.userId"
				:isAdmin="sources[currentMediaSource.id].isAdmin"
				:video="event"
				:membersIndex="membersIndex"
				:isPlaying="event.type !== 'text' && isPlaying && (currentMedia.id == event.id)"
				:key="index"></component>
		</ul>
	</div>
	<div class="matrix-chat__footer">
		<span
			@click="setMainLeftTab('playList')"
			class="wmp-icon-speaker_notes_off matrix-chat__off"></span>
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
	background-color: $color-catskillwhite
	color: $color-aluminium-dark
	.wmp-icon-send
		cursor: pointer
	input
		flex: 1
		padding: 0 #{2 * $grid-space}
		font-size: .8rem

</style>
