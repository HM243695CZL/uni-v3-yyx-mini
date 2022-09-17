<template>
	<view class="user-container">
		<view class="head-card flex-between">
			<view class="left">
				<view class="name" @click="showLoginMethod()">{{userInfo.id ? userInfo.nickname : '点击登录'}}</view>
			</view>
			<image v-if="userInfo.id" class="img-avatar" mode="aspectFill" :src="userInfo.avatar"></image>
		</view>
		<view class="order-status-list flex-between">
			<view class="tab-box" v-for="item in state.orderStatusList" :key="item.value" @click="showOrderList(item)">
				<uni-icons class="icon" custom-prefix="iconfont" :type="'icon-' + item.icon" size="30"></uni-icons>
				{{item.text}}
			</view>
		</view>
		<view class="icon-list">
			<view class="icon-list-item flex-between"
				v-for="item in state.iconList" :key="item.value"
				@click="clickIconItem(item)"
			 >
				<view class="icon-list-item-left flex-start">
					<uni-icons custom-prefix="iconfont" :type="'icon-' + item.icon" size="20"></uni-icons>
					<view class="item-text">{{item.text}}</view>
				</view>
				<uni-icons class="icon" type="right" size="20"></uni-icons>
			</view>
		</view>
		<view class="logout-btn" v-if="userInfo.id">
			<view class="logout" @click="logout()">退出登录</view>
		</view>
		<view class="technical-support">
			HL243695CZYN提供技术支持
		</view>
	</view>
</template>

<script setup lang="ts">
	import { reactive, computed } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getUserInfoApi } from '@/api/user';
	import { SUCCESS_CODE } from '@/utils/request';
	import store from '@/store';
	const state = reactive({
		orderStatusList: [
			{ value: '0', text: '全部', icon: 'order' },
			{ value: '1', text: '待付款', icon: 'To_be_paid' },
			{ value: '2', text: '待发货', icon: '-Shipped'},
			{ value: '3', text: '待收货', icon: 'goods' },
			{ value: '4', text: '待评价', icon: 'iconevaluate' }
		],
		iconList: [
			{ value: 'afterSale', text: '我的售后', icon: 'after-sale', path: '/sub/afterSale/afterSale'},
			{ value: 'address', text: '我的地址', icon: 'address', path: '/sub/addressList/addressList'},
			{ value: 'paperplane', text: '我的足迹', icon: 'footprint', path: '/sub/footprintList/footprintList'},
			{ value: 'collection', text: '我的收藏', icon: 'star', path: '/sub/collectionList/collectionList'},
			{ value: 'advise', text: '意见反馈', icon: 'idea', path: '/sub/advise/advise'}
		]
	});
	const userInfo = computed(() => {
		return store.state.userInfo.userInfo;
	});
	const showLoginMethod = () => {
		if (userInfo.value.id) return false;
		uni.navigateTo({
			url: '/sub/loginMethod/loginMethod'
		})
	};
	const getUserInfo = refresh => {
		getUserInfoApi({
			refresh: true
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				store.dispatch('setUserInfo', res.data);
				uni.setStorage({
					key: 'userInfo',
					data: res.data
				})
			}
		})
	};
	const clickIconItem = data => {
		if (!userInfo.value.id) {
			uni.navigateTo({
				url: '/sub/loginMethod/loginMethod'
			});
		} else {
			uni.navigateTo({
				url: data.path
			})
		}
	};
	const logout = () => {
		uni.clearStorage();
		store.dispatch('setUserInfo',{});
	};
	
	const showOrderList = data => {
		uni.navigateTo({
			url: '/sub/myOrderList/myOrderList?type=' + data.value
		});
	};
	onLoad(option => {
		if (!userInfo.value.id) {
			uni.getStorage({
				key: 'token',
				success: res => {
					getUserInfo(option.refresh);
				},
				fail: err => {
					console.log('未登录');
				}
			})
		}
	});
</script>


<style lang="scss">
	.user-container{
		font-size: $uni-font-size-base;
		background-color: $uni-color-white;
		height: 100%;
		.head-card{
			height: 160rpx;
			background-color: $uni-color-base;
			padding: $uni-padding;
			.left{
				.name{
					color: $uni-color-white;
					font-size: 50rpx;
				}
			}
			.img-avatar{
				width: 120rpx;
				height: 120rpx;
				border-radius: 50%;
			}
		}
		.order-status-list{
			padding: $uni-padding;
			.tab-box{
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex-direction: column;
				.icon{
					margin-bottom: $uni-padding-half;
				}
			}
		}
		.icon-list{
			margin-top: $uni-padding;
			padding: 0 $uni-padding;
			background-color: $uni-color-white;
			.icon-list-item{
				padding: $uni-padding 0;
				border-bottom: 1px solid $uni-color-bd;
				.item-text{
					margin-left: $uni-padding-half;
				}
				&:last-child{
					border-bottom: none;
				}
			}
		}
		.logout-btn{
			margin-top: $uni-padding;
			padding: $uni-padding;
			.logout{
				border-radius: 10rpx;
				padding: $uni-padding 0;
				text-align: center;
				background-color: #f5f5f5;
				color: $uni-color-text;
			}
		}
		.technical-support{
			color: $uni-color-text;
			text-align: center;
			height: 150rpx;
			line-height: 150rpx;
			font-size: $uni-font-size-sm;
		}
	}
</style>
