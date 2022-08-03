<template>
	<view class="shop-container">
		<view class="goods-list">
			<view class="list-box"  v-if="state.cartList.length > 0">
				<uni-swipe-action>
					<uni-swipe-action-item
						:right-options="state.swipeOption"
						:show="state.isOpened"
						:auto-close="false"
						@click="clickSwiper($event, item.id)"
						v-for="item in state.cartList" :key="item.id"
					>
						<view class="list-item">
							<view class="item-box flex-between">
								<checkbox-group @change="changeCheck($event, item.productId)">
									<checkbox :value="item.productId" :checked="item.checked" color="#36c1ba" />
								</checkbox-group>
								<view class="img-pic">
									<image class="img" mode="aspectFit" :src="item.picUrl"></image>
								</view>
								<view class="info text-over">
									<view class="name text-over">{{item.goodsName}}</view>
									<view class="tag-list flex-start" v-for="ele in JSON.parse(item.specifications)" :key="ele">
										<view class="tag">{{ele}}</view>
									</view>
									<view class="price-box flex-between">
										<view class="price">￥{{item.price}}</view>
										<view class="count">x{{item.number}}</view>
									</view>
								</view>
							</view>
							<view class="create-time">
								添加日期：{{item.addTime}}
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			</view>
			<view class="btn-box" v-if="state.cartList.length > 0" @click="emptyAll()">
				<view class="btn">清空全部</view>
			</view>
			<view class="no-data" v-if="state.cartList.length === 0">暂无数据</view>
		</view>
		<view class="check-all flex-between">
			<checkbox-group @change="changeCheck($event, 'all')">
				<label>
					<checkbox class="check-box" value="all" 
						:disabled="state.checkIds.length === 0"
						:checked="state.checkIds.length === state.cartList.length && state.checkIds.length !== 0"
						color="#36c1ba" />
					全选
				</label>
			</checkbox-group>
			<view class="all-price flex-end">
				总计<text class="settle-price">￥{{state.allPrice}}</text>
				<view class="settlement" @click="showWriteOrder()">结算</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, computed } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import {getCartInfoApi, changeCheckedApi, emptyCartApi} from '@/api/cart';
	import { SUCCESS_CODE } from '@/utils/request';
	import store from '@/store';
	
	const state = reactive({
		cartList: [],
		checkIds: [],
		allPrice: 0,
		cartTotal: {},
		isOpened: 'none',
		selectedIds: [],
		swipeOption: [
			{
				text: '取消',
				style: {
					backgroundColor: '#ff6146'
				}
			}, 
			{
				text: '删除',
				style: {
					backgroundColor: '#36c1ba'
				}
			}
		]
	});
	
	const getCartInfo = () => {
		getCartInfoApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				store.dispatch('setCartCount', res.data.cartTotal.goodsCount);
				uni.setStorageSync('cartCount', res.data.cartTotal.goodsCount);
				initData(res.data);
			}
		})
	};
	
	const changeCheck = (e, id) => {
		const isChecked = e.detail.value.length > 0;
		let productIds = [];
		if (id === 'all') {
			state.cartList.map(item => {
				productIds.push(item.productId)
			})
		} else {
			productIds = [id];
		}
		changeCheckedApi({
			isChecked,
			productIds
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				initData(res.data);
			}
		})
	};
	
	const initData = data => {
		state.cartList = data.cartList;
		state.cartTotal = data.cartTotal;
		state.allPrice = data.cartTotal.checkedGoodsAmount;
		state.checkIds = [];
		data.cartList.map(item => {
			if (item.checked) {
				state.checkIds.push(item.productId);
			}
		})
	};
	
	const clickSwiper = (data, id) => {
		if (data.index === 1) {
			state.selectedIds = [id];
			emptyCart();
		}
	};
	
	const emptyAll = () => {
		const arr = [];
		state.cartList.map(item => {
			arr.push(item.id);
		});
		state.selectedIds = arr;
		emptyCart();
	};
	
	const emptyCart = () => {
		emptyCartApi(state.selectedIds).then(res => {
			if (res.status === SUCCESS_CODE) {
				getCartInfo();
			}
		})
	};
	
	const showWriteOrder = () => {
		if (state.checkIds.length === 0) {
			uni.showToast({
				title: '请选择结算商品',
				icon: 'none'
			});
			return false;
		}
		const cardIds = [];
		state.cartList.map(item => {
			if (item.checked) {
				cardIds.push(item.id)
			}
		})
		uni.navigateTo({
			url: '/sub/writeOrder/writeOrder?cartIds=' + cardIds
		})
	};
	
	onShow(() => {
		getCartInfo();
	});
	
</script>


<style lang="scss">
	.shop-container{
		background-color: $uni-color-bg;
		height: 100%;
		.goods-list{
			height: calc(100% - 120rpx);
			overflow: auto;
			.list-item{
				padding: $uni-padding;
				margin-bottom: $uni-padding-half;
				background: $uni-color-white;
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
				.create-time{
					font-size: $uni-font-size-sm;
					color: $uni-color-9;
					margin-top: $uni-padding-half;
					text-align: right;
				}
			}
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
		.check-all{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: $uni-padding;
			background-color: $uni-color-white;
			.all-price{
				.settle-price{
					color: $uni-color-price;
				}
				.settlement{
					margin-left: $uni-padding-half;
					padding: 8rpx 20rpx;
					background: $uni-color-base;
					color: $uni-color-white;
					border-radius: 10rpx;
				}
			}
		}
	}
</style>
