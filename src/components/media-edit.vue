<script>
import { mapState, mapActions } from 'vuex';

import { debounce } from '../utils';

export default {
	computed: {
		...mapState(['showMediaEdit', 'entities']),
		media() {
			if (!this.showMediaEdit) return {};
			return this.entities[this.showMediaEdit];
		},
	},
	methods: {
		...mapActions(['setRoomName', 'updateRoomOptions', 'setRoomTag']),
	},
};
</script>

<template>
<div
	v-if="showMediaEdit"
	class="settings media-edit">
	<input
		@input="_setRoomName(currentMatrixRoom, $event.target.value)"
		type="text"
		class="media-edit__name"
		placeholder="… title"
		:value="media.title">
	<div class="box-1-1 media-edit__limits">
		<div>
			<label>Start</label>
			<div><input class="input--border" type="number" :value="media.start">s</div>
		</div>
		<div>
			<label>Stop</label>
			<div><input class="input--border" type="number" placeholder="">s</div>
		</div>
	</div>
	<div class="row media-edit__links">
		<div>
			<th>Thumbnail</th>
			<td>
				<input
					type="text"
					:value="media.thumbUrl"
					placeholder="… https://example.com/img/video.png">
			</td>
			<td></td>
		</div>
		<tr>
			<th>Source</th>
			<td>
				<input
				type="text"
				:value="media.href"
				placeholder="… https://example.com/video-item">
			</td>
			<td></td>
		</tr>
	</div>
	<div class="row">
		<label>Track parser</label><br>
		<textarea class="input--border" cols="30" rows="4" placeholder="… insert text with tracks"></textarea>
		<button class="button btn--blue">Parse</button>
	</div>
	<div class="spacer"></div>
</div>
</template>

<style lang="sass?indentedSyntax">
@import '../sass/vars'
@import '../sass/color'
.settings.media-edit
	.row, h3, h4, .media-edit__name
		padding: 0 $grid-space
	.media-edit__name
		font-size: 1.5rem
		height: $touch-size-huge
		width: 100%
		margin-bottom: $grid-space
	.spacer
		height: #{2 * $grid-space}
	th, label
		text-align: left
		font-weight: normal
		color: $color-aluminium
		text-transform: uppercase
		font-size: .7rem
		padding-right: #{2 * $grid-space}
.media-edit__limits
	width: 100%
	overflow: hidden
	padding: 0 $grid-space
	>div:first-child
			margin-right: 2 * $grid-space
	label + div
		display: flex
		align-items: center
		input
			width: 2*$touch-size-medium
			margin-right: $grid-space
</style>
