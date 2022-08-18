<template>
	<view class="pay-success-container">
		<view class="success-icon flex-center">
			<view class="circle flex-center">
				<uni-icons type="checkmarkempty" size="30" color="#fff"></uni-icons>
			</view>
			<text class="success-text">支付成功</text>
		</view>
		<view class="price-box flex-center">
			<view class="tip">微信支付商家</view>
			<view class="price">￥{{(state.actualPrice * 100 / 100).toFixed(2)}}</view>
		</view>
		<view class="btn-box flex-center">
			<view class="success-btn" @click="showOrderList()">完成</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	
	const state = reactive({
		orderId: '',
		actualPrice: 0
	});
	
	const showOrderList = () => {
		uni.redirectTo({
			url: '/sub/myOrderList/myOrderList?type=all'
		});
	}
	
	onLoad(ops => {
		state.orderId = ops.orderId;
		state.actualPrice = parseInt(ops.actualPrice);
	})
</script>

<style lang="scss">
	.pay-success-container{
		margin-top: 100rpx;
		.success-icon{
			flex-direction: column;
			.circle{
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				background-color: $uni-color-base;
			}
			.success-text{
				margin-top: $uni-padding;
				color: $uni-color-base;
			}
		}
		.price-box{
			margin-top: 100rpx;
			flex-direction: column;
			.price{
				margin-top: $uni-padding;
				font-size: $uni-font-size-lg;
				font-weight: 700;
			}
		}
		.btn-box{
			position: fixed;
			bottom: 100rpx;
			left: 0;
			right: 0;
			.success-btn{
				width: 200rpx;
				text-align: center;
				padding: $uni-padding-half $uni-padding;
				color: $uni-color-base;
				border: 1px solid $uni-color-base;
			}
		}
	}
</style>