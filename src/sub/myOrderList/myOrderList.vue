<template>
	<view class="my-order-list-container">
		<view class="tab-bar">
			<view 
			:class="['item', state.type === key ? 'active': '']"
			 v-for="(val, key) in state.tabBar" :key="key"
			 @click="changeTabBar(key)"
			 >
				<view class="tab-txt">{{val}}</view>
			 </view>
		</view>
		<view class="order-box">
			<view class="list-item" v-for="item in state.dataList" :key="item.id">
				<view class="head">
					<view class="order-number">
						订单编号：{{item.orderSn}}
					</view>
					<view class="order-status">{{item.orderStatusText}}</view>
				</view>
				<view class="order-goods-list">
					<view class="item-box " v-for="ele in item.orderGoodsList" :key="ele.id">
						<view class="goods-info flex-between">
							<view class="img-pic">
								<image class="img" mode="aspectFill" :src="ele.picUrl"></image>
							</view>
							<view class="info text-over">
								<view class="name text-over">{{ele.goodsName}}</view>
								<view class="tag-list flex-start" v-for="e in JSON.parse(ele.specifications)" :key="e">
									<view class="tag">{{e}}</view>
								</view>
								<view class="price-box flex-between">
									<view class="price">￥{{(ele.price * 100 / 100).toFixed(2)}}</view>
									<view class="count">x{{ele.number}}</view>
								</view>
							</view>
						</view>
						<view class="comment-btn flex-end" v-if="item.handleOption.comment && (ele.comment === 0)">
							<view class="btn" @click="clickComment(ele)">去评价</view>
						</view>
					</view>
				</view>
				<view class="foot flex-between">
					<view class="price-txt">
						合计：
						<text class="price">￥{{(item.actualPrice * 100 / 100).toFixed(2)}}</text>
					</view>
					<view class="oper-btn flex-end">
						<view class="btn" v-if="item.handleOption.cancel" @click="cancelOrder(item)">取消订单</view>
						<view class="btn" v-if="item.handleOption.pay" @click="goPay(item)">去支付</view>
						<view class="btn" v-if="item.handleOption.refund" @click="applyRefund(item)">申请退款</view>
						<view class="btn" v-if="item.handleOption.logistics">查看物流</view>
						<view class="btn" v-if="item.handleOption.confirm" @click="orderReceive(item)">确认收货</view>
						<view class="btn" v-if="item.handleOption.delete" @click="clickDelete(item)">删除订单</view>
					</view>
				</view>
			</view>
			<view class="no-data" v-if="state.dataList.length === 0">暂无数据</view>
		</view>
		<uni-popup ref="refundDialog" type="dialog">
			<uni-popup-dialog cancelText="取消" confirmText="确定退款" title="请选择退款原因" @confirm="clickRefundConfirm">
				 <view class="select-list">
					 <uni-data-checkbox
					  v-model="state.reason" 
					  :localdata="state.reasonList"
					  selectedColor="#36c1ba"
					  selectedTextColor="#36c1ba"
					  ></uni-data-checkbox>
				 </view>
			</uni-popup-dialog>
		</uni-popup>
		<uni-popup ref="confirmDialog" type="dialog">
			<uni-popup-dialog cancelText="取消" confirmText="确认" title="提示" @confirm="clickReceiveConfirm">
				<view>确认收货后无法撤销！</view>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import { getOrderListApi, cancelOrderApi, refundOrderApi,
	 receiveOrderApi, deleteOrderApi } from '@/api/order';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		dataList: [],
		type: '',
		pageIndex: 1,
		pageSize: 20,
		tabBar: {
			0: '全部',
			1: '待付款',
			2: '待发货',
			3: '待收货',
			4: '待评价'
		},
		orderId: '',
		reason: 1,
		reasonList: [
			{ text: '收到商品破损', value: 1 },
			{ text: '商品错发/漏发', value: 2 },
			{ text: '商品需要维修', value: 3 },
			{ text: '收到商品与描述不符', value: 4 },
			{ text: '商品质量问题', value: 5 },
			{ text: '不想买了/买错了', value: 6 }
		]
	});
	const refundDialog = ref();
	const confirmDialog = ref();
	
	const getOrderList = () => {
		getOrderListApi({
			type: state.type,
			pageIndex: state.pageIndex,
			pageSize: state.pageSize
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.dataList = res.data;
			}
		})
	};
	
	
	const changeTabBar = key => {
		if (state.type === key) return false;
		state.type = key;
		state.pageIndex = 1;
		state.pageSize = 20;
		getOrderList();
	};
	
	/**
	 * 取消订单
	 */
	const cancelOrder = data => {
		cancelOrderApi({
			orderId: data.id
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.showToast({
					title: '取消成功',
					icon: 'success'
				});
				getOrderList();
			}
		})
	};
	
	/**
	 * 去支付
	 */
	const goPay = data => {
		uni.navigateTo({
			url: '/sub/goPayment/goPayment?orderId=' + data.id
		});
	};
	
	/**
	 * 申请退款
	 */
	const applyRefund = data => {
		state.orderId = data.id;
		refundDialog.value.open();
	};
	
	/**
	 * 确定退款
	 */
	const clickRefundConfirm = () => {
		let refundReason = '';
		state.reasonList.map(item => {
			if (item.value === state.reason) {
				refundReason = item.text;
			}
		})
		refundOrderApi({
			orderId: state.orderId,
			refundReason
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.showToast({
					title: '已申请退款',
					icon: 'success'
				});
				getOrderList();
			}
		})
	};
	
	/**
	 * 点击确认收货
	 */
	const orderReceive = data => {
		state.orderId = data.id;
		confirmDialog.value.open();
	};
	
	/**
	 * 确认收货
	 */
	const clickReceiveConfirm = () => {
		receiveOrderApi({
			orderId: state.orderId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.showToast({
					icon: 'success'
				});
				getOrderList();
			}
		})
	};
	
	/**
	 * 点击删除
	 */
	const clickDelete = data => {
		deleteOrderApi({
			orderId: data.id
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				});
				getOrderList();
			}
		})
	};
	
	/**
	 * 点击去评价
	 */
	const clickComment = data => {
		uni.navigateTo({
			url: '/sub/commentGoods/commentGoods?orderGoodsId=' + data.id
		})
	}
	
	
	onLoad(ops => {
		state.type = ops.type;
		getOrderList();
	});
	onShow(() => {
		getOrderList();
	});
</script>

<style scoped lang="scss">
	.my-order-list-container{
		background-color: $uni-color-bg;
		height: 100%;
		.tab-bar{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: $uni-padding-half;
			.item{
				flex: 1;
				padding: $uni-padding-half $uni-padding;
				text-align: center;
				&.active{
					.tab-txt{
						color: $uni-color-base;
						border-bottom: 2px solid $uni-color-base;
					}
				}
				.tab-txt{
					padding-bottom: $uni-padding-half;
					border-bottom: 2px solid transparent;
				}
			}
		}
		.order-box{
			height: calc(100% - 95rpx);
			overflow: auto;
			.list-item{
				padding: $uni-padding;
				background-color: $uni-color-white;
				margin-bottom: $uni-padding-half;
				border-bottom: 1px solid $uni-color-bd;
				.head{
					padding: $uni-padding-half 0;
					border-bottom: 1px solid $uni-color-bd;
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					.order-number{
						flex: 1;
					}
					.order-status{
						color: $uni-color-price;
					}
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
					.comment-btn{
						margin-top: $uni-padding-half;
						.btn{
							padding: 8rpx 16rpx;
							border-radius: 10rpx;
							border: 1px solid $uni-color-text;
							font-size: $uni-font-size-sm;
							color: $uni-color-text;
						}
					}
				}
				.foot{
					padding: $uni-padding-half 0;
					.price-txt{
						.price{
							margin-left: $uni-padding-half;
							font-weight: 700;
							color: $uni-color-black;
						}
					}
					.oper-btn{
						.btn{
							padding: 8rpx 16rpx;
							border-radius: 10rpx;
							border: 1px solid $uni-color-text;
							font-size: $uni-font-size-sm;
							color: $uni-color-text;
							margin-right: $uni-padding-half;
							&:last-child{
								margin-right: 0;
							}
						}
					}
				}
			}
		}
	}
	.select-list{
		width: 200rxp;
	}
</style>