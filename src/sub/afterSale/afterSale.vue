<template>
	<view class="after-sale-container">
		<view class="tab-bar">
			<view 
			:class="['item', state.status === key ? 'active' : '']"
			 v-for="(val, key) in state.statusObj" :key="key"
			 @click="changeTabBar(key)"
			 >
				<view class="tab-txt">{{val}}</view>
			 </view>
		</view>
		<view class="after-sale-box">
			<view class="list-item" v-for="item in state.dataList" :key="item.id">
				<view class="head">
					<view class="order-number">
						售后编号：{{item.aftersaleSn}}
					</view>
				</view>
				<view class="order-goods-list" @click="showAfterSaleInfo(item.orderId)">
					<view class="item-box " v-for="ele in item.orderGoodsList" :key="ele.id">
						<view class="goods-info flex-between">
							<view class="img-pic">
								<image class="img" mode="aspectFill" :src="ele.picUrl"></image>
							</view>
							<view class="info text-over">
								<view class="name text-over">{{ele.goodsName}}</view>
								<view class="goods-count">{{ele.number}}件商品</view>
							</view>
						</view>
					</view>
				</view>
				<view class="foot flex-between">
					<view class="price-txt">
						申请退款金额：
						<text class="price">￥{{(item.amount * 100 / 100).toFixed(2)}}</text>
					</view>
				</view>
			</view>
			<view class="no-data" v-if="state.dataList.length === 0">暂无数据</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
	import { reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getAfterSaleListApi} from '@/api/afterSale';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		pageIndex: 1,
		pageSize: 20,
		status: '1',
		dataList: [],
		statusObj: {
			1: '申请中',
			2: '处理中',
			3: '已完成',
			4: '已拒绝',
		}
	});
	
	const getAfterSaleList = () => {
		getAfterSaleListApi({
			pageIndex: state.pageIndex,
			pageSize: state.pageSize,
			status: state.status
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.dataList = res.data.list;
			}
		})
	};
	
	const changeTabBar = (key: number) => {
		if (state.status === key) return false;
		state.status = key;
		state.pageIndex = 1;
		state.pageSize = 20;
		getAfterSaleList();
	};
	
	const showAfterSaleInfo = (orderId: any) => {
		uni.navigateTo({
			url: '/sub/afterSaleInfo/afterSaleInfo?orderId=' + orderId
		});
	}
	
	onLoad(() => {
		getAfterSaleList();
	});
</script>

<style lang="scss" scoped>
	.after-sale-container{
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
		.after-sale-box{
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
				}
			}
		}
	}
</style>