<template>
	<view class="goods-info-container">
		<uni-swiper-dot :info="state.info" :current="state.current" field="content" :mode="state.mode" :dots-styles="state.dotsStyles">
			<swiper class="swiper-box" @change="change">
				<swiper-item v-for="(item ,index) in state.info" :key="index">
					<view class="swiper-item">
						<image mode="scaleToFill" :src="item"></image>
					</view>
				</swiper-item>
			</swiper>
		</uni-swiper-dot>
		<view class="goods-name text-over">{{state.goodsInfo.goods.name}}</view>
		<view class="goods-info">
			<text class="brief">{{state.goodsInfo.goods.brief}}</text>
			<view class="price flex-start">
				<text class="counter-price">原价: ￥{{state.goodsInfo.goods.counterPrice}}</text>
				<text class="view-retail-price">现价: ￥{{state.goodsInfo.goods.retailPrice}}</text>
			</view>
		</view>
		<view class="select-specification flex-between">
			<view class="title">请选择规格数量</view>
			<uni-icons class="icon" type="right" size="20"></uni-icons>
		</view>
		<view class="params">
			<view class="params-title">商品参数</view>
			<view class="params-row" v-for="item in state.goodsInfo.attributes" :key="item.id">
				<view class="key text-over">{{item.attribute}}</view>
				<view class="value">{{item.value}}</view>
			</view>
		</view>
		<ParseHtml :htmlStr="state.goodsInfo.goods.detail" />
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getGoodsInfoApi } from '@/api/goods';
	import { SUCCESS_CODE } from '@/utils/request';
	import ParseHtml from '@/components/ParseHtml';
	
	const state = reactive({
		goodsId: null,
		goodsInfo: {
			goods: {},
			attributes: []
		},
		info: [],
		current: 0,
		mode: 'round',
		dotsStyles: {
			backgroundColor: '#fff',
			border: '1px #fff solid',
			color: '#fff',
			selectedBackgroundColor: '#fff',
			selectedBorder: '1px #fff solid'
		}
	});
	
	const change = e => {
		state.current = e.detail.current;
	}
	
	const getGoodsInfo = () => {
		getGoodsInfoApi({
			goodsId: state.goodsId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.goodsInfo = res.data;
				state.info = JSON.parse(state.goodsInfo.goods.gallery);
			}
		})
	};
	
	onLoad(option => {
		state.goodsId = option.id;
		getGoodsInfo();
	})
</script>

<style lang="scss">
	.goods-info-container{
		background-color: $uni-color-bg;
		height: 100%;
		.swiper-box{
			height: 600rpx;
			.swiper-item{
				height: 100%;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.goods-name{
			padding: $uni-padding-half $uni-padding;
			background-color: #f4f4f4;
			font-weight: 700;
			box-sizing: border-box;
		}
		.goods-info{
			padding: $uni-padding-half $uni-padding;
			box-sizing: border-box;
			background-color: $uni-color-white;
			border-bottom: 1px solid $uni-color-bd;
			.brief{
				font-size: $uni-font-size-sm;
				color: $uni-color-9;
			}
			.price{
				padding: $uni-padding 0;
				.counter-price{
					text-decoration: line-through;
					color: $uni-color-9;
				}
				.view-retail-price{
					margin-left: $uni-padding;
					color: $uni-color-price;
				}
			}
		}
		.select-specification{
			background-color: $uni-color-white;
			padding: $uni-padding;
		}
		.params{
			margin-top: $uni-padding;
			background-color: $uni-color-white;
			padding: $uni-padding;
			box-sizing: border-box;
			.params-title{
				font-size: $uni-font-size-lg;
			}
			.params-row{
				padding: $uni-padding-half;
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				.key{
					color: $uni-color-text;
					min-width: 120rpx;
				}
				.value{
					flex: 1;
					padding-left: $uni-padding;
				}
			}
		}
	}
</style>
