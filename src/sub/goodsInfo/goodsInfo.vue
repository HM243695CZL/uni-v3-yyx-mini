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
		<view class="select-specification flex-between" @click="chooseSpecification()">
			<view class="title">请选择规格数量</view>
			<uni-icons class="icon" type="right" size="20"></uni-icons>
		</view>
		<view class="params">
			<view class="params-title">商品参数</view>
			<view class="params-row" v-for="item in state.goodsInfo.attributes" :key="item.id">
				<view class="key text-over">{{item.attribute}} :</view>
				<view class="value">{{item.value}}</view>
			</view>
		</view>
		<ParseHtml :content="state.goodsInfo.goods.detail" />
		<view class="common-question">
			<view class="title">常见问题</view>
			<view class="question-list">
				<view class="question-item" v-for="item in state.questionList" :key="item.id">
					<view class="question">
						<text class="circle"></text>
					{{item.question}}
					</view>
					<view class="answer">{{item.answer}}</view>
				</view>
			</view>
		</view>
		<ChooseSpecifition :info="state.goodsInfo" ref="chooseSpecifitionRef" />
		<CartBar />
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getGoodsInfoApi } from '@/api/goods';
	import { getIssueListApi } from '@/api/issue';
	import { SUCCESS_CODE } from '@/utils/request';
	import ParseHtml from '@/components/ParseHtml';
	import CartBar from '@/components/CartBar';
	import ChooseSpecifition from '@/components/ChooseSpecifition';
	
	const chooseSpecifitionRef = ref();
	const state = reactive({
		goodsId: null,
		goodsInfo: {
			goods: {},
			products: [],
			specificationList: []
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
		},
		questionList: []
	});
	
	const change = e => {
		state.current = e.detail.current;
	}
	
	const getGoodsInfo = () => {
		getGoodsInfoApi({
			goodsId: state.goodsId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.goodsInfo.goods = res.data.goods;
				state.info = JSON.parse(state.goodsInfo.goods.gallery);
				state.goodsInfo.products = res.data.products;
				state.goodsInfo.specificationList = res.data.specificationList;
			}
		})
	};
	
	const getIssueList = () => {
		getIssueListApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				state.questionList = res.data;
			}
		})
	};
	
	const chooseSpecification = () => {
		chooseSpecifitionRef.value.openPopup()
	};
	
	onLoad(option => {
		state.goodsId = option.id;
		getGoodsInfo();
		getIssueList();
	})
</script>

<style lang="scss">
	.goods-info-container{
		background-color: $uni-color-bg;
		padding-bottom: 100rpx;
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
		.common-question{
			background-color: $uni-color-white;
			padding: $uni-padding;
			box-sizing: border-box;
			.title{
				font-weight: bold;
				font-size: $uni-font-size-lg;
			}
			.question-list{
				.question-item{
					padding: $uni-padding 0;
					.question{
						.circle{
							display: inline-block;
							width: 10rpx;
							height: 10rpx;
							margin-right: $uni-padding-half;
							background: $uni-color-base;
						}
					}
					.answer{
						color: $uni-color-gray;
						line-height: 50rpx;
					}
				}
			}
		}
	}
</style>
