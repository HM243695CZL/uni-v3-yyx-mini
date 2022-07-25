<template>
	<view class="address-list-container">
		<view class="address-card" v-if="state.dataList.length > 0">
			<view class="card-item" v-for="item in state.dataList" :key="item.id">
				<view class="head flex-start">
					<view class="name text-over">{{item.name}}</view>
					<view class="tel">{{item.tel}}</view>
				</view>
				<view class="address-info">
					<text class="county">
						{{item.province}}{{item.city}}{{item.county}}
					</text>
					<text class="detail">
						{{item.addressDetail}}
					</text>
				</view>
				<uni-icons class="icon" @click="clickEmpty(item)" color="#36c1ba" type="closeempty" size="20"></uni-icons>
			</view>
		</view>
		<view class="no-data" v-if="state.dataList.length <= 0">暂无数据</view>
		<view class="btn-box">
			<view class="btn" @click="showEditAddress()">添加收货地址</view>
			<view v-if="state.dataList.length > 0" class="btn" @click="emptyAll()">清空全部</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import {onShow} from '@dcloudio/uni-app';
	import {getAddressListApi, emptyAddressApi} from '@/api/address';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		dataList: [],
		selectedIds: []
	})
	
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
	}
	
	onShow(() => {
		getAddressList();
	})
</script>

<style lang="scss">
	.address-list-container{
		background-color: $uni-color-bg;
		height: 100%;
		padding: $uni-padding;
		.address-card{
			position: relative;
			margin-bottom: $uni-padding;
			.card-item{
				padding: $uni-padding;
				border-radius: $uni-padding-half;
				background: $uni-color-white;
				.head{
					.tel{
						margin-left: $uni-padding;
						width: 200rpx;
					}
				}
				.address-info{
					margin-top: $uni-padding;
					.detail{
						margin-left: $uni-padding;
					}
				}
			}
			.icon{
				position: absolute;
				right: $uni-padding-half;
				bottom: $uni-padding-half;
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