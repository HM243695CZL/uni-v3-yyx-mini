<template>
	<view class="search-icon" @click="showSearch()">
		<uni-icons color="#36c1ba" type="search" size="30"></uni-icons>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	
	const showSearch = () => {
		uni.navigateTo({
			url: '/sub/searchHistory/searchHistory'
		})
	}
</script>

<style lang="scss">
	.search-icon{
		position: fixed;
		top: 50%;
		right: 10rpx;
	}
</style>