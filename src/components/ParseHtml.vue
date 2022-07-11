<template>
	<view class="parse-html-container">
		<uParse :content="formatParse()" :imageProp="state.imageProp" />
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import uParse from '@/components/u-parse/u-parse.vue';
	const props = defineProps({
		content: {
			type: String,
			default: ''
		}
	});
	const state = reactive({
		imageProp: {
			mode: 'scaleToFill'
		},
	});
	const formatParse = () => {
		const regex = new RegExp('<img','gi');
		return props.content.replace(regex,'<img style="width:100%;"');
	}
</script>

<style lang="scss">
	@import url('@/components/u-parse/u-parse.css');
	.parse-html-container{
		background-color: $uni-color-white;
		padding: $uni-padding;
	}
</style>