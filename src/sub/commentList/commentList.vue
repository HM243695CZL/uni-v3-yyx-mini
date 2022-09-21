<template>
	<view class="comment-list-container">
		<view class="tab-list flex-center">
			<view :class="['list-item', item.value === state.currentTab ? 'active' : '']" 
				v-for="item in state.tabList" :key="item.value"
				@click="changeTab(item)"
			>
				<text class="item">{{item.text}}({{item.count}})</text>
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
			<view v-if="state.commentList.length === 0" class="no-data">暂无数据</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getGoodsCommentsApi, getCommentsCountApi } from '@/api/goods';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		goodsId: '',
		tabList: [
			{
				text: '全部',
				value: '',
				count: 0
			},
			{
				text: '有图',
				value: '1',
				count: 0
			}
		],
		currentTab: '',
		commentList: [],
	});
	
	const getCommentsCount = () => {
		getCommentsCountApi({
			goodsId: state.goodsId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.tabList[0].count = res.data.allCount;
				state.tabList[1].count = res.data.hasPicCount;
			}
		})
	};
	
	const getGoodsComments = () => {
		getGoodsCommentsApi({
			pageIndex: 1,
			pageSize: 20,
			type: state.currentTab,
			goodsId: state.goodsId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.commentList = res.data.list;
			}
		})
	};
	
	const changeTab = data => {
		if (data.value === state.currentTab) return false;
		state.currentTab = data.value;
		getGoodsComments();
	};
	
	onLoad(ops => {
		state.goodsId = ops.goodsId;
		getCommentsCount();
		getGoodsComments();
	})
</script>

<style lang="scss">
	.comment-list-container{
		height: 100%;
		.tab-list{
			.list-item{
				flex: 1;
				text-align: center;
				padding: $uni-padding-half $uni-padding;
				.item{
					padding: $uni-padding-half 50rpx;
					border-bottom-color: 1px solid transparent;
				}
				&.active{
					.item{
						color: $uni-color-base;
						border-bottom: 1px solid $uni-color-base;
					}
				}
			}
		}
		.comment-content{
			padding: $uni-padding;
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
</style>