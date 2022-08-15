<template>
	<view class="write-order-container">
		<view class="address-item" @click="showAddressList()">
			<view class="address-info">
				<view class="txt">收货地址</view>
				<view class="info">
					<view class="connect-user">
						{{state.addressInfo.name}}
						<text class="phone">{{state.addressInfo.tel}}</text>
					</view>
					<view class="detail-address">{{state.addressInfo.addressDetail}}</view>
				</view>
			</view>
			<uni-icons class="icon" type="right" size="20"></uni-icons>
		</view>
		<view class="product-list">
			<view class="list-item" v-for="item in state.checkedGoodsList" :key="item.id">
				<view class="item-box flex-between">
					<view class="img-pic">
						<image class="img" mode="aspectFit" :src="item.picUrl"></image>
					</view>
					<view class="info text-over">
						<view class="name text-over">{{item.goodsName}}</view>
						<view class="tag-list flex-start" v-for="ele in JSON.parse(item.specifications)" :key="ele">
							<view class="tag">{{ele}}</view>
						</view>
						<view class="price-box flex-between">
							<view class="price">￥{{(item.price * 100 / 100).toFixed(2)}}</view>
							<view class="count">x{{item.number}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="info-box">
			<view class="list-item flex-start">
				<view class="key">商品金额</view>
				<view class="value price">￥{{(state.checkedGoodsPrice * 100 / 100).toFixed(2)}}</view>
			</view>
			<view class="list-item flex-start">
				<view class="key">运费</view>
				<view class="value price">￥{{(state.freightPrice * 100 / 100).toFixed(2)}}</view>
			</view>
			<view class="list-item flex-start">
				<view class="key">备注</view>
				<view class="value">
					<uni-easyinput v-model="state.remark" placeholder="请输入备注"></uni-easyinput>
				</view>
			</view>
		</view>
		<view class="total-bar">
			总计：<view class="price">￥{{(state.orderTotalPrice * 100 / 100).toFixed(2)}}</view>
			<view class="sub-btn" @click="clickSubmit()">提交订单</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getShoppingOrderApi } from '@/api/cart';
	import {getAddressInfoApi} from '@/api/address';
	import {submitOrderInfoApi} from '@/api/order';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		cartIds: [],
		checkedGoodsList: [],
		checkedGoodsPrice: 0,
		freightPrice: 0,
		orderTotalPrice: 0,
		remark: '',
		addressId: uni.getStorageSync('addressId'),
		addressInfo: {}
	});
	
	const getShoppingOrder = () => {
		getShoppingOrderApi(state.cartIds).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.checkedGoodsList = res.data.checkedGoodsList;
				state.checkedGoodsPrice = res.data.checkedGoodsPrice;
				state.freightPrice = res.data.freightPrice;
				state.orderTotalPrice = res.data.orderTotalPrice;
			}
		})
	};
	
	const showAddressList = () => {
		uni.navigateTo({
			url: '/sub/addressList/addressList?type=order'
		});
	};
	
	const getAddressInfo = () => {
		if (state.addressId) {
			getAddressInfoApi({
				id: state.addressId
			}).then(res => {
				if (res.status === SUCCESS_CODE) {
					state.addressInfo = res.data;
				}
			})
		}
	};
	
	const getAddressId = data => {
		if (state.addressId !== data) {
			state.addressId = data;
			getAddressInfo();
		}
	};
	
	const clickSubmit = () => {
		if (!state.addressId) {
			uni.showToast({
				title: '请选择收货地址',
				icon: 'none'
			});
			return false;
		};
		uni.navigateTo({
			url: '/sub/goPayment/goPayment'
		});
		// submitOrderInfoApi({
		// 	addressId: state.addressId,
		// 	cartIds: state.cartIds,
		// 	message: state.remark
		// }).then(res => {
		// 	if (res.status === SUCCESS_CODE) {
		// 		console.log(res);
		// 	}
		// })
	};
	
	onLoad(ops => {
		state.cartIds = ops.cartIds.split(',');
		getAddressInfo();
		getShoppingOrder();
	});
	
	defineExpose({
		getAddressId
	});
</script>

<style lang="scss">
	.write-order-container{
		background-color: $uni-color-bg;
		height: 100%;
		.address-item{
			padding: $uni-padding;
			margin-bottom: $uni-padding-half;
			background: $uni-color-white;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			.address-info{
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				flex-direction: column;
				.info{
					margin-top: $uni-padding-half;
					color: $uni-color-9;
					.phone{
						margin-left: $uni-padding-half;
					}
				}
			}
		}
		.product-list{
			.list-item{
				padding: $uni-padding;
				margin-bottom: $uni-padding-half;
				background: $uni-color-white;
				&:last-child{
					margin-bottom: 0;
				}
				.item-box{
					.img-pic{
						.img{
							width: 150rpx;
							height: 150rpx;
						}
					}
					.info{
						flex: 1;
						padding: 0 $uni-padding-half;
						.tag-list{
							margin: $uni-padding-half 0;
							.tag{
								padding: 6rpx 10rpx;
								background: $uni-color-base;
								color: $uni-color-white;
								margin-right: $uni-padding-half;
								border-radius: 10rpx;
								&:last-child{
									margin-right: 0;
								}
							}
						}
						.price-box{
							.price{
								color: $uni-color-price;
							}
							.count{
								color: $uni-color-9;
							}
						}
					}
				}
			}
		}
		.info-box{
			padding: 0 $uni-padding;
			background-color: $uni-color-white;
			.list-item{
				padding: $uni-padding 0;
				.key{
					width: 120rpx;
				}
				.value{
					flex: 1;
					text-align: right;
				}
				.price{
					color: $uni-color-price;
				}
			}
		}
		.total-bar{
			position: fixed;
			left: 0;
			bottom: 0;
			right: 0;
			background: $uni-color-white;
			padding: $uni-padding-half $uni-padding;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.price{
				color: $uni-color-price;
			}
			.sub-btn{
				margin-left: $uni-padding;
				background: linear-gradient(90deg,#ff6034,#ee0a24);
				color: $uni-color-white;
				padding: $uni-padding-half $uni-padding;
				border-radius: 20rpx;
			}
		}
	}
</style>