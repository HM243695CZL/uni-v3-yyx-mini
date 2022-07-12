<template>
	<view class="parse-html-container">
		<mp-html :content="props.content" />
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	const props = defineProps({
		content: {
			type: String,
			default: ''
		}
	});
</script>

<style lang="scss">
	.parse-html-container{
		background-color: $uni-color-white;
		padding: $uni-padding;
	}
</style>