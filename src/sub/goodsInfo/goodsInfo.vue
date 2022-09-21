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
				<text class="counter-price">原价: ￥{{(state.goodsInfo.goods.counterPrice * 100 / 100).toFixed(2)}}</text>
				<text class="view-retail-price">现价: ￥{{(state.goodsInfo.goods.retailPrice * 100 / 100).toFixed(2)}}</text>
			</view>
		</view>
		<view class="select-specification flex-between" @click="chooseSpecification()">
			<view class="title">请选择规格数量</view>
			<uni-icons class="icon" type="right" size="20"></uni-icons>
		</view>
		<view class="comment-box" v-if="state.commentCount > 0">
			<view class="comment-head flex-between">
				<view class="comment-count">评论({{state.commentCount}})</view>
				<view class="show-all" @click="showAllComment()">
					查看全部
					<uni-icons class="icon" type="right" size="20"></uni-icons>
				</view>
			</view>
			<view class="comment-content">
				<view class="comment-item" v-for="item in state.commentList" :key="item.id">
					<view class="comment-info flex-between">
						<view class="comment-user">{{item.username}}</view>
						<view class="comment-time">{{item.addTime}}</view>
					</view>
					<view class="content">{{item.content}}</view>
					<view class="imgs flex-start">
						<image mode="aspectFit" v-for="ele in JSON.parse(item.picUrls)" :key="ele" :src="ele"></image>
					</view>
					<view class="reply" v-if="item.adminContent !== ''">
						商家回复：<text class="reply-content">{{item.adminContent}}</text>
					</view>
				</view>
			</view>
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
		<CartBar v-if="state.loadStatus" 
			:collect="state.collect" 
			:goodsId="state.goodsId"
			 :prev-path="state.currentPath" 
			 @show-choose-spec="chooseSpecification()"
		 />
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getGoodsInfoApi, getGoodsCommentsApi } from '@/api/goods';
	import { getIssueListApi } from '@/sub/api/issue';
	import { SUCCESS_CODE } from '@/utils/request';
	import ParseHtml from '@/components/ParseHtml';
	import CartBar from '@/components/CartBar';
	import ChooseSpecifition from '@/components/ChooseSpecifition';
	
	
	const chooseSpecifitionRef = ref();
	const state = reactive({
		currentPath: '',
		goodsId: null,
		collect: '0', // 0 未收藏 1 已收藏
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
		commentList: [],
		commentCount: 0,
		questionList: [],
		loadStatus: false
	});
	
	const change = e => {
		state.current = e.detail.current;
	}
	
	const getGoodsInfo = () => {
		state.loadStatus = false;
		getGoodsInfoApi({
			goodsId: state.goodsId
		}).then(res => {
			state.loadStatus = true;
			if (res.status === SUCCESS_CODE) {
				state.goodsInfo.goods = res.data.goods;
				state.info = JSON.parse(state.goodsInfo.goods.gallery);
				state.goodsInfo.products = res.data.products;
				state.goodsInfo.specificationList = res.data.specificationList;
				state.collect = res.data.collect;
			}
		})
	};
	
	const getIssueList = () => {
		getIssueListApi('').then(res => {
			if (res.status === SUCCESS_CODE) {
				state.questionList = res.data;
			}
		})
	};
	
	const chooseSpecification = () => {
		chooseSpecifitionRef.value.openPopup()
	};
	
	const getCurrentPath = data => {
		const pages = getCurrentPages();
		const currentRoute = pages[pages.length - 1].route;
		let params = '';
		if (Object.keys(data)) {
			params = Object.keys(data).reduce((prev, curr) => {
				return prev + curr + '=' + data[curr] + '&';
			}, '?').slice(0, -1);
		}
		state.currentPath = '/' + currentRoute + params;
	};
	
	const getGoodsComments = () => {
		getGoodsCommentsApi({
			pageIndex: 1,
			pageSize: 2,
			goodsId: state.goodsId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.commentList = res.data.list;
				state.commentCount = res.data.total;
			}
		})
	};
	
	const showAllComment = () => {
		uni.navigateTo({
			url: '/sub/commentList/commentList?goodsId=' + state.goodsId
		})
	};
	
	onLoad(option => {
		state.goodsId = option.id;
		getGoodsInfo();
		getIssueList();
		getCurrentPath(option);
		getGoodsComments();
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
		.comment-box{
			margin-top: $uni-padding;
			background-color: $uni-color-white;
			padding: $uni-padding;
			box-sizing: border-box;
			.comment-head{
				padding-bottom: $uni-padding;
			}
			.comment-content{
				border-top: 1px solid $uni-color-bd;
				.comment-item{
					border-bottom: 1px solid $uni-color-bd;
					padding: $uni-padding 0;
					&:last-child{
						border: none;
					}
					.comment-info{
						padding-bottom: $uni-padding;
						.comment-time{
							font-size: $uni-font-size-sm;
							color: $uni-color-9;
						}
					}
					.imgs{
						padding-top: $uni-padding;
						image{
							width: 150rpx;
							height: 150rpx;
							border-radius: $uni-padding-half;
							margin-right: $uni-padding-half;
						}
					}
					.reply{
						margin-top: $uni-padding;
						border-radius: $uni-padding-half;
						padding: $uni-padding;
						background-color: #f4f4f4;
						.reply-content{
							color: $uni-color-9;
						}
					}
				}
			}
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
