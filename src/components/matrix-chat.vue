<script >
import Vue from 'vue';
import { mapMutations, mapState, mapActions } from 'vuex';
import { mapModuleState } from '../utils';
import VideoItem from './video-item.vue';
import ChatMessage from './matrix-chat-message.vue';

let latestCreatedAt = null;
let lastHeight = 0;
let scrollDown = false;
let inputLength = 0;
export default {
	components: {
		VideoItem,
		ChatMessage,
	},
	data() {
		return {
			messageText: '',
			overflow: false,
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
			if (!chatLog) return;
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
		$chat.addEventListener('wheel', this.scrolled);
		$chat.addEventListener('scroll', this.scrolled);
	},
	computed: {
		...mapState(['currentMediaSource', 'currentMedia', 'isPlaying', 'paginationIndex', 'isLoading']),
		...mapModuleState('matrix', ['chatLog', 'credentials', 'membersIndex', 'sources']),
		_chatLog() {
			return (this.chatLog[this.currentMediaSource.id] || []).filter(({ parentEvent }) => !parentEvent);
		},
		_isLoading() {
			return this.isLoading[this.currentMediaSource.id];
		},
	},
	methods: {
		...mapMutations(['setMainLeftTab']),
		...mapActions(['matrixLoadMore', 'matrixSendText']),
		scrolled(event) {
			// if (this._isLoading) event.preventDefault();
			// Detect when scrolled to top.
			if (this.$refs.chat.scrollTop === 0) {
				this.matrixLoadMore(this.currentMediaSource.id);
			}
		},
		send(event) {
			event.preventDefault();
			if (this.messageText) {
				this.matrixSendText({
					roomId: this.currentMediaSource.id,
					message: this.messageText.trim(),
				});
				this.messageText = '';
				this.overflow = false;
			}
		},
		checkWidth(event) {
			if (this.$refs.message.offsetHeight - this.$refs.message.scrollHeight < 0) {
				if (!this.overflow) inputLength = this.$refs.message.value.length;
				this.overflow = true;
			} else if (this.$refs.message.value.length < inputLength) {
				this.overflow = false;
				inputLength = this.$refs.message.value.length;
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
			<div class="loader" v-show="_isLoading"></div>
		</div>
		<ul ref="list">
			<component
				v-for="(event, index) in _chatLog"
				v-bind:is="event.type === 'text' ? 'chat-message' : 'video-item'"
				:isAuthor="event.sender === credentials.userId"
				:isAdmin="sources[currentMediaSource.id].isAdmin || event.sender === credentials.userId"
				:video="event"
				:membersIndex="membersIndex"
				:enableDelete="sources[currentMediaSource.id].isAdmin || event.sender === credentials.userId"
				:isPlaying="event.type !== 'text' && isPlaying && (currentMedia.id == event.id)"
				:key="index"></component>
		</ul>
	</div>
	<div class="matrix-chat__footer" :class="{ 'matrix-chat--overflow' : overflow }">
		<span
			@click="setMainLeftTab('playList')"
			class="wmp-icon-speaker_notes_off matrix-chat__off"></span>
		<textarea
			rows="1"
			ref="message"
			placeholder="… your message"
			@keyup="checkWidth"
			@keyup.enter="send"
			v-model="messageText">
		</textarea>
		<span class="wmp-icon-send" @click="send"></span>
	</div>
</div>
</template>

<style lang="sass">
@import '../sass/vars'
@import '../sass/color'

.matrix-chat
	display: flex
	position: relative
	flex-direction: column
	height: 100%
	background: url('../website/static/img/music-notes.jpg')
	background-color: $color-athensgrey
	background-size: 200px
	overflow: hidden
	.play-list
		flex: 1
		height: auto
		overflow-x: hidden
		overflow-y: auto
	ul
		margin: 0
		padding: 0
		list-style: none
	.media-list__main
		padding: 0 5.5%
		background-color: $color-white
.matrix-chat__off
	cursor: pointer
	z-index: 1

.play-list__load-more
	min-height: $touch-size-medium
.matrix-chat__footer
	display: flex
	align-items: center
	justify-content: space-between
	width: 100%
	height: $touch-size-medium
	background-color: $color-catskillwhite
	color: $color-aluminium-dark
	&.matrix-chat--overflow
		height: 2 * $touch-size-medium
		textarea
			height: #{12 * $grid-space}

	.wmp-icon-send
		cursor: pointer
	textarea
		flex: 1
		padding: $grid-space #{2 * $grid-space}
		font-size: .8rem

</style>
