<template>
	<view class="address-list-container">
		<view class="btn-box">
			<view class="btn" @click="showEditAddress()">添加收货地址</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	
	const showEditAddress = () => {
		uni.navigateTo({
			url: '/sub/addressEdit/addressEdit'
		});
	}
</script>

<style lang="scss">
	.address-list-container{
		.btn-box{
			margin-top: $uni-padding;
			padding: $uni-padding;
			.btn{
				border-radius: 10rpx;
				padding: $uni-padding 0;
				text-align: center;
				background-color: $uni-color-base;
				color: $uni-color-white;
			}
		}
	}
</style>