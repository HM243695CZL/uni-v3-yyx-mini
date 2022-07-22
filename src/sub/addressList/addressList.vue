<template>
	<view class="address-list-container">
		<view class="btn-box">
			<view class="btn" @click="showEditAddress()">添加收货地址</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import {onLoad} from '@dcloudio/uni-app';
	import {getAddressListApi} from '@/api/address';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		dataList: []
	})
	
	const showEditAddress = () => {
		uni.navigateTo({
			url: '/sub/addressEdit/addressEdit'
		});
	};
	
	const getAddressList = () => {
		getAddressListApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				state.dataList = res.data.list;
			}
		})
	};
	
	onLoad(() => {
		getAddressList();
	})
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