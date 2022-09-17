<template>
	<view class="after-sale-info-container">
		<view class="refund-info">
			<view class="head">退款明细</view>
			<view class="refund-info-list">
				<view class="list-item flex-between">
					<view class="op-key"><text class="star">*</text>售后状态</view>
					<view class="op-value">{{state.statusObj[state.aftersale.status]}}</view>
				</view>
				<view class="list-item flex-between">
					<view class="op-key"><text class="star">*</text>申请时间</view>
					<view class="op-value">{{state.aftersale.addTime}}</view>
				</view>
				<view class="list-item flex-between">
					<view class="op-key"><text class="star">*</text>服务编号</view>
					<view class="op-value">{{state.aftersale.aftersaleSn}}</view>
				</view>
				<view class="list-item flex-between">
					<view class="op-key"><text class="star">*</text>退款类型</view>
					<view class="op-value">{{state.typeObj[state.aftersale.type]}}</view>
				</view>
				<view class="list-item flex-between">
					<view class="op-key"><text class="star">*</text>退款原因</view>
					<view class="op-value text-over">{{state.aftersale.reason}}</view>
				</view>
				<view class="list-item flex-between">
					<view class="op-key"><text class="star">*</text>退款金额</view>
					<view class="value op-value">
						<view class="price">￥{{(state.aftersale.amount * 100 / 100).toFixed(2)}}</view>
					</view>
				</view>
				<view class="list-item flex-between">
					<view class="op-key">退款说明</view>
					<view class="op-value text-over">{{state.aftersale.comment}}</view>
				</view>
				<view class="list-item flex-between">
					<view class="op-key">上传凭证</view>
					<view class="op-value">
						<image class="img-upload" mode="aspectFill" 
							v-for="item in state.aftersalePictures"
							:key="item"
							:src="item"
						></image>
					</view>
				</view>
			</view>
		</view>
		<view class="refund-goods">
			<view class="head">退款商品</view>
			<view class="order-goods-list">
				<view class="item-box" v-for="item in state.orderGoodsList" :key="item.id">
					<view class="goods-info flex-between">
						<view class="img-pic">
							<image class="img" mode="aspectFill" :src="item.picUrl"></image>
						</view>
						<view class="info text-over">
							<view class="name text-over">{{item.goodsName}}</view>
							<view class="tag-list flex-start" v-for="e in JSON.parse(item.specifications)" :key="e">
								<view class="tag">{{e}}</view>
							</view>
							<view class="price-box flex-between">
								<view class="price">￥{{(item.price * 100 / 100).toFixed(2)}}</view>
								<view class="count">x{{item.number}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="order-detail">
			<view class="head">订单明细</view>
			<view class="order-info-list">
				<view class="list-item flex-between">
					<view class="key">商品总价</view>
					<view class="value">
						<view class="price">￥{{(state.orderInfo.goodsPrice * 100 / 100).toFixed(2)}}</view>
					</view>
				</view>
				<view class="list-item flex-between">
					<view class="key">运费</view>
					<view class="value">
						<view class="price">￥{{(state.orderInfo.freightPrice * 100 / 100).toFixed(2)}}</view>
					</view>
				</view>
				<view class="list-item flex-between">
					<view class="key">订单实付</view>
					<view class="value">
						<view class="price">￥{{(state.orderInfo.actualPrice * 100 / 100).toFixed(2)}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getAfterSaleInfoApi } from '@/api/afterSale';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		orderId: '',
		orderInfo: {},
		orderGoodsList: [],
		aftersale: {},
		statusObj: {
			0: '未申请',
			1: '已申请，待审核',
			2: '审核通过，待退款',
			3: '退款成功',
			4: '审核不通过，已拒绝'
		},
		typeObj: {
			0: '未收货退款',
			1: '不退货退款',
			2: '退货退款'
		},
		aftersalePictures: []
	});
	
	const getAfterSaleInfo = () => {
		getAfterSaleInfoApi({
			id: state.orderId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.orderInfo = res.data.orderInfo;
				state.orderGoodsList = res.data.orderGoodsList;
				state.aftersale = res.data.aftersale;
				state.aftersalePictures = JSON.parse(state.aftersale.pictures);
			}
		})
	}
	
	onLoad(ops => {
		state.orderId = ops.orderId;
		getAfterSaleInfo();
	})
</script>

<style lang="scss" scoped>
	.after-sale-info-container{
		background-color: $uni-color-bg;
		height: 100%;
		overflow-y: auto;
		.refund-info, .refund-goods, .order-detail{
			padding: $uni-padding;
			background-color: $uni-color-white;
			margin-bottom: $uni-padding-half;
			.head{
				padding: $uni-padding-half 0;
				border-bottom: 1px solid $uni-color-bd;
				font-weight: 700;
			}
			.order-goods-list{
				.item-box{
					margin-top: $uni-padding-half;
					padding-bottom: $uni-padding-half;
					border-bottom: 1px solid $uni-color-bd;
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
			.order-info-list, .refund-info-list{
				.list-item{
					padding: $uni-padding 0;
					border-bottom: 1px solid $uni-color-bd;
					.key{
						.star{
							color: $uni-color-price;
						}
						.tip{
							color: $uni-color-9;
						}
					}
					.op-key{
						width: 160rpx;
						.star{
							color: $uni-color-price;
						}
					}
					.value{
						.price{
							color: $uni-color-price;
						}
					}
					.op-value{
						color: $uni-color-9;
						flex: 1;
						text-align: right;
						.img-upload{
							width: 100rpx;
							height: 100rpx;
							margin-right: $uni-padding;
							&:last-child{
								margin-right: 0;
							}
						}
						::v-deep .uni-easyinput{
							text-align: right;
						}
					}
				}
			}
		}
	}
</style>