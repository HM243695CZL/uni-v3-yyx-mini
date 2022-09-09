<template>
	<view class="comment-goods-container">
		<view class="goods-info">
			<view class="img-pic">
				<image class="img" mode="aspectFill" :src="state.orderGoodsInfo.picUrl"></image>
			</view>
			<view class="title">{{state.orderGoodsInfo.goodsName}}</view>
		</view>
		<view class="score flex-start">
			<text class="txt">总体评分：</text><uni-rate v-model="state.star" @change="changeRate" />
			<view class="rate-state">{{state.rateObj[state.star]}}</view>
		</view>
		<view class="content-box">
			<uni-easyinput type="textarea" v-model="state.content"
				placeholder="请输入商品评价"
				maxlength="500"
				autoHeight
			></uni-easyinput>
		</view>
		<uni-file-picker
			limit="4" 
			v-model="state.picUrls" 
			:imageStyles="state.imageStyle" 
			file-mediatype="image"
			file-extname="png,jpg"
			@select="selectImg" 
		></uni-file-picker>
		<button type="primary" @click="confirm()">发表</button>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getOrderGoodsInfoApi, commentOrderGoodsApi } from '@/api/order';
	import {policyApi} from '@/api/oss';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		orderGoodsId: '',
		orderGoodsInfo: {},
		star: 0,
		content: '',
		picUrls: [],
		rateObj: {
			1: '很差',
			2: '不太满意',
			3: '满意',
			4: '比较满意',
			5: '十分满意'
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
	
	const getOrderGoodsInfo = () => {
		getOrderGoodsInfoApi({
			orderGoodsId: state.orderGoodsId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.orderGoodsInfo = res.data;
			}
		})
	};
	
	const changeRate = data => {
		state.star = data.value;
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
							state.picUrls.push(state.dataObj.host + '/' + state.dataObj.dir + '/' + fileList[i].name)
						}
					})
				}
			}
		})
	};
	
	const confirm = () => {
		commentOrderGoodsApi({
			star: state.star,
			content: state.content,
			picUrls: JSON.stringify(state.picUrls),
			hasPicture: state.picUrls.length > 0,
			valueId: state.orderGoodsId,
			type: 0
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.showToast({
					icon: 'success'
				});
				uni.navigateBack();
			}
		})
	};
	
	onLoad(ops => {
		state.orderGoodsId = ops.orderGoodsId;
		getOrderGoodsInfo();
	});
</script>

<style lang="scss">
	.comment-goods-container{
		padding: $uni-padding;
		height: 100%;
		background-color: $uni-color-white;
		box-sizing: border-box;
		.goods-info{
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			.img-pic{
				.img{
					width: 150rpx;
					height: 150rpx;
					border-radius: $uni-padding-half $uni-padding-half 0 0;
				}
			}
			.title{
				flex: 1;
				padding-left: $uni-padding;
			}
		}
		.score{
			padding: $uni-padding 0;
			.txt{
				margin-right: $uni-padding;
			}
			.rate-state{
				margin-left: $uni-padding;
			}
		}
		.content-box{
			margin: $uni-padding 0;
		}
		button{
			margin-top: $uni-padding;
			color: $uni-color-white;
			background-color: $uni-color-base;
		}
	}
</style>