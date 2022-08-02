<template>
	<view class="shop-container">
		<view class="goods-list">
			<view class="list-item" v-for="item in state.cartList" :key="item.id">
				<view class="item-box flex-between">
					<checkbox class="check-box" :value="item.id" :checked="item.checked" color="#36c1ba" />
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
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import {onLoad, onHide} from '@dcloudio/uni-app';
	import {getCartInfoApi} from '@/api/cart';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		cartList: [],
		checkIds: []
	})
	
	const getCartInfo = () => {
		getCartInfoApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				state.cartList = res.data;
			}
		})
	}
	
	getCartInfo();
	
	onHide(() => {
		console.log('隐藏');
	})
</script>


<style lang="scss">
	.shop-container{
		background-color: $uni-color-bg;
		height: 100%;
		.goods-list{
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
		}
	}
</style>
