<template>
	<view class="go-payment-container">
		<view class="title flex-start">
			请在
			<uni-countdown color="#ff6146" 
			:start="state.start" 
			:showDay="false" 
			@timeup="timeup"
			:hour="state.hour" 
			:minute="state.minute" 
			:second="state.second" />
			内完成付款，否则系统自动取消订单
		</view>
		<view class="order-card">
			<view class="order-item flex-between">
				<view class="key">订单编号</view>
				<view class="value">{{state.orderSn}}</view>
			</view>
			<view class="order-item flex-between">
				<view class="key">实付金额</view>
				<view class="value">
					<view class="price">￥{{(state.actualPrice * 100 / 100).toFixed(2)}}</view>
				</view>
			</view>
		</view>
		<view class="pay-method">
			<div class="head">请选择支付方式</div>
			<view class="pay-box">
				<view class="pay-item flex-start" @click="changePayMethod('ali')">
					<view class="pay-img">
						<image class="pay-img-ali" src="../../static/img/ali_pay.png" mode="aspectFill"></image>
					</view>
					<uni-icons :type="state.payMethod === 'ali' ? 'circle-filled' : 'circle'" color="#36c1ba" size="25"></uni-icons>
				</view>
				<view class="pay-item flex-start" @click="changePayMethod('wx')">
					<view class="pay-img">
						<image class="pay-img-wx" src="../../static/img/wx_pay.png" mode="aspectFill"></image>
					</view>
					<uni-icons :type="state.payMethod === 'wx' ? 'circle-filled' : 'circle'" color="#36c1ba" size="25"></uni-icons>
				</view>
			</view>
		</view>
		<view class="pay-btn" @click="pay()">
			去支付
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getOrderInfoApi, payOrderApi } from '@/api/order';
	import { SUCCESS_CODE } from '@/utils/request';
	import { timestampToDate} from '@/utils/tool';
	
	const state = reactive({
		payMethod: 'wx',
		orderId: '',
		orderSn: '',
		actualPrice: '',
		hour: 0,
		minute: 30,
		second: 0,
		start: false
	});
	
	const changePayMethod = type => {
		state.payMethod = type;
	};
	
	const getOrderInfo = () => {
		getOrderInfoApi({
			orderId: state.orderId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.orderSn = res.data.orderInfo.orderSn;
				state.actualPrice = res.data.orderInfo.actualPrice;
				const unpairTime = res.data.unpairTime;
				const time = new Date(unpairTime).getTime() - new Date().getTime();
				// 将时间戳转为时分秒
				const {hour, minute, second} = timestampToDate(time);
				state.hour = hour;
				state.minute = minute;
				state.second = second;
				state.start = true;
			}
		})
	};
	
	const timeup = () => {
		uni.reLaunch({
			url: '/pages/shop/shop'
		});
	};
	
	const pay = () => {
		payOrderApi({
			orderId: state.orderId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.redirectTo({
					url: '/sub/paySuccess/paySuccess?orderId=' + res.data.orderId + '&actualPrice=' + res.data.actualPrice
				})
			}
		})
	};
	
	
	onLoad(ops => {
		state.orderId = ops.orderId;
		getOrderInfo();
	})
</script>

<style lang="scss">
	.go-payment-container{
		background-color: $uni-color-bg;
		height: 100%;
		.title{
			padding: $uni-padding;
			background-color: #fffeec;
			margin-bottom: $uni-padding-half;
		}
		.order-card{
			margin-bottom: $uni-padding-half;
			padding: $uni-padding;
			background-color: $uni-color-white;
			.order-item{
				margin-bottom: $uni-padding-half;
				.price{
					color: $uni-color-price;
				}
			}
		}
		.pay-method{
			background-color: $uni-color-white;
			padding: $uni-padding;
			.pay-box{
				margin-top: $uni-padding-half;
				.pay-item{
					padding: $uni-padding-half;
					border-bottom: 1px solid $uni-color-bd;
					&:last-child{
						border: none;
					}
					.pay-img{
						margin-right: $uni-padding;
						width: 320rpx;
						.pay-img-ali{
							width: 164rpx;
							height: 58rpx;
						}
						.pay-img-wx{
							width: 226rpx;
							height: 46rpx;
						}
					}
				}
			}
		}
		.pay-btn{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: $uni-padding 0;
			text-align: center;
			background-color: $uni-color-base;
			color: $uni-color-white;
		}
	}
</style>