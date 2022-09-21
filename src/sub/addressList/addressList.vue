<template>
	<view class="address-list-container">
		<view class="address-card" v-if="state.dataList.length > 0">
			<view :class="['card-item', (item.id === state.addressId && state.type === 'order') ? 'active' : '']" v-for="item in state.dataList" :key="item.id" @click="chooseAddress(item.id)">
				<view class="head flex-between">
					<view class="flex-start">
						<view class="name text-over">{{item.name}}</view>
						<view class="tel">{{item.tel}}</view>
					</view>
					<view v-if="item.isDefault" class="is-default">默认</view>
					<view v-if="!item.isDefault && state.type !== 'order'" class="set-default" @click="setDefaultAddress(item.id)">设为默认</view>
				</view>
				<view class="address-info">
					<text class="county">
						{{item.province}}{{item.city}}{{item.county}}
					</text>
					<text class="detail">
						{{item.addressDetail}}
					</text>
				</view>
			</view>
		</view>
		<view class="no-data" v-if="state.dataList.length <= 0">暂无数据</view>
		<view class="btn-box" v-if="state.type !== 'order'">
			<view class="btn" @click="showEditAddress()">添加收货地址</view>
			<view v-if="state.dataList.length > 0" class="btn" @click="emptyAll()">清空全部</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import {onShow, onLoad} from '@dcloudio/uni-app';
	import {getAddressListApi, emptyAddressApi, setDefaultAddressApi} from '@/sub/api/address';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		dataList: [],
		selectedIds: [],
		type: '',
		addressId: uni.getStorageSync('addressId')
	});
	
	const showEditAddress = () => {
		uni.navigateTo({
			url: '/sub/addressEdit/addressEdit'
		});
	};
	
	const getAddressList = () => {
		getAddressListApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				state.dataList = res.data;
			}
		})
	};
	
	const emptyAddress = () => {
		emptyAddressApi(state.selectedIds).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.showToast({
					icon: 'success',
				});
				getAddressList();
			}
		})
	};
	
	const clickEmpty = data => {
		state.selectedIds = [data.id];
		emptyAddress();
	};
	
	const emptyAll = () => {
		const arr = [];
		state.dataList.map(item => {
			arr.push(item.id);
		});
		state.selectedIds = arr;
		emptyAddress();
	};
	
	const chooseAddress = id => {
		if (state.type === 'order') {
			uni.setStorageSync('addressId', id);
			let pages = getCurrentPages();
			const prevPage = pages[pages.length - 2];
			prevPage.$vm.getAddressId(id);
			uni.navigateBack();
		}
	};
	
	const setDefaultAddress = id => {
		let defaultId = 0;
		state.dataList.map(item => {
			if (item.isDefault) {
				defaultId = item.id;
			}
		})
		setDefaultAddressApi({
			selectId: id,
			defaultId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.showToast({
					title: '设置成功',
					icon: 'none'
				});
				getAddressList();
			}
		})
	};
	
	onShow(() => {
		getAddressList();
	});
	
	onLoad(ops => {
		state.type = ops.type
	});
</script>

<style lang="scss">
	.address-list-container{
		background-color: $uni-color-bg;
		height: 100%;
		padding: $uni-padding;
		.address-card{
			margin-bottom: $uni-padding;
			.card-item{
				padding: $uni-padding;
				border-radius: $uni-padding-half;
				background: $uni-color-white;
				margin-bottom: $uni-padding-half;
				&.active{
					border: 2rpx dashed $uni-color-base;
				}
				.head{
					.tel{
						margin-left: $uni-padding;
						width: 200rpx;
					}
					.is-default{
						color: $uni-color-base;
					}
					.set-default{
						padding: $uni-padding-half;
						font-size: $uni-font-size-sm;
						border-radius: 15rpx;
						color: $uni-color-price;
						border: 1px solid $uni-color-price;
					}
				}
				.address-info{
					margin-top: $uni-padding;
					.detail{
						margin-left: $uni-padding;
					}
				}
			}
		}
		.btn-box{
			.btn{
				border-radius: 10rpx;
				padding: $uni-padding 0;
				text-align: center;
				background-color: $uni-color-base;
				color: $uni-color-white;
				margin-bottom: $uni-padding;
			}
		}
	}
</style>