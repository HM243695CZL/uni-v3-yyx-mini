<template>
	<view class="apply-after-sale-container">
		<view class="content-box">
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
			<view class="refund-operate">
				<view class="head">退款操作</view>
				<view class="refund-info-list">
					<picker @change="changeType" :value="state.type" :range="state.typeList">
						<view class="list-item flex-between">
							<view class="key op-key"><text class="star">*</text>退款类型</view>
							<view class="value op-value">{{state.typeList[state.type] ? state.typeList[state.type] : '请选择'}}</view>
						</view>
					</picker>
					<view class="list-item flex-between">
						<view class="key op-key"><text class="star">*</text>退款原因</view>
						<view class="value op-value">
							<uni-easyinput v-model="state.reason" :inputBorder="false" placeholder="请输入" />
						</view>
					</view>
					<view class="list-item flex-between">
						<view class="key op-key"><text class="star">*</text>退款金额</view>
						<view class="value">
							<view class="price">￥{{(state.amount * 100 / 100).toFixed(2)}}</view>
						</view>
					</view>
					<view class="list-item flex-between">
						<view class="key op-key">退款说明</view>
						<view class="value op-value">
							<uni-easyinput v-model="state.comment" :inputBorder="false" placeholder="请输入" />
						</view>
					</view>
					<view class="list-item flex-between">
						<view class="key">上传凭证<text class="tip">(最多三张)</text></view>
						<view class="value">
							<uni-file-picker
								limit="3" 
								v-model="state.pictures" 
								:imageStyles="state.imageStyle" 
								file-mediatype="image"
								file-extname="png,jpg"
								@select="selectImg" 
							></uni-file-picker>
						</view>
					</view>
				</view>
			</view>
		</view>
		<button type="primary" @click="confirm()">提交</button>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { SUCCESS_CODE } from '@/utils/request';
	import {getOrderInfoApi, afterSaleOrderApi } from '@/api/order';
	import {policyApi} from '@/api/oss';
	
	const state = reactive({
		orderId: '',
		orderGoodsList: [],
		orderInfo: {},
		type: '',
		typeList: ['未收货退款', '不退货退款', '退货退款'],
		reason: '',
		comment: '',
		pictures: [],
		amount: 0,
		imageStyle: {
			width: 50,
			height: 50
		},
		dataObj: {
			policy: '',
			signature: '',
			key: '',
			ossAccessKeyId: '',
			dir: '',
			host: ''
		},
	});
	
	const getOrderInfo = () => {
		getOrderInfoApi({
			orderId: state.orderId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.orderInfo = res.data.orderInfo;
				state.orderGoodsList = res.data.orderGoodsList;
				state.amount = state.orderInfo.actualPrice - state.orderInfo.freightPrice;
			}
		})
	};
	
	const changeType = data => {
		state.type = data.detail.value;
	};
	
	const selectImg = e => {
		let fileList = e.tempFiles;
		policyApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				const {accessKeyId, dir, host, policy, signature} = res.data;
				state.dataObj.policy = policy;
				state.dataObj.signature = signature;
				state.dataObj.key = dir + '/${filename}';
				state.dataObj.ossAccessKeyId = accessKeyId;
				state.dataObj.dir = dir;
				state.dataObj.host = host;
				for (let i = 0; i < fileList.length; i++) {
					uni.uploadFile({
						url: host,
						filePath: fileList[i].path,
						name: 'file',
						fileType: 'image',
						formData: state.dataObj,
						success: result => {
							state.pictures.push(state.dataObj.host + '/' + state.dataObj.dir + '/' + fileList[i].name)
						}
					})
				}
			}
		})
	};
	
	const confirm = () => {
		if (state.type === '') {
			uni.showToast({
				title: '请选择类型',
				icon: 'error'
			});
			return false;
		}
		if (state.reason === '') {
			uni.showToast({
				title: '请输入原因',
				icon:'error'
			});
			return false;
		}
		afterSaleOrderApi({
			orderId: state.orderId,
			type: state.type,
			reason: state.reason,
			amount: state.amount,
			pictures: JSON.stringify(state.pictures),
			comment: state.comment
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.showToast({
					title: '已申请',
					icon: 'success'
				});
				uni.navigateBack();
			}
		})
	};
	
	onLoad(ops => {
		state.orderId = ops.id;
		getOrderInfo();
	})
</script>

<style scoped lang="scss">
	.apply-after-sale-container{
		background-color: $uni-color-bg;
		height: 100%;
		.content-box{
			height: calc(100% - 85rpx);
			overflow-y: auto;
			.refund-goods, .order-detail, .refund-operate{
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
						}
						.value{
							color: $uni-color-9;
							.price{
								color: $uni-color-price;
							}
						}
						.op-value{
							flex: 1;
							text-align: right;
							::v-deep .uni-easyinput{
								text-align: right;
							}
						}
					}
				}
			}
		}
		button{
			border-radius: 0;
			color: $uni-color-white;
			background-color: $uni-color-base;
		}
	}
</style>