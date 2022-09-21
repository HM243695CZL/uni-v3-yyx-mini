<template>
	<view class="search-history-container">
		<uni-search-bar class="uni-mt-10" radius="5"
			v-model="state.keyword"
			placeholder="请输入商品名称" 
			clearButton="auto" cancelButton="none" @confirm="search" 
			@input="input"
		/>
		<view class="helper-list" v-if="state.goodsList.length === 0">
			<view class="list-item" v-for="item in state.helperList" :key="item" @click="clickHelper(item)">
				{{item}}
			</view>
		</view>
		<view class="empty-history" v-if="userInfo.id && state.historyList.length > 0" @click="clickEmptyHistory()">
			<text>清空历史</text>
			<uni-icons type="trash-filled" color="#787878" size="18"></uni-icons>
		</view>
		<div class="hot-list" v-if="state.hotList.length > 0">
			<text class="tip">热门搜索：</text>
			<text class="tag" v-for="item in state.hotList" :key="item" @click="clickKeyword(item)">
				{{item}}
			</text>
		</div>
		<view class="history-list" v-if="state.historyList.length > 0">
			<text class="tip">搜索历史：</text>
			<text class="tag" v-for="item in state.historyList" :key="item" @click="clickKeyword(item)">
				{{item}}
			</text>
		</view>
		<UserGoodsList :dataList="state.goodsList" type="search"></UserGoodsList>
	</view>
</template>

<script setup lang="ts">
	import {  reactive, computed } from 'vue';
	import {onLoad} from '@dcloudio/uni-app';
	import {
		getSearchHelperApi, getSearchHistoryListApi, 
		getSearchGoodsListApi, getRecommendAndHotKeywordApi,
		emptySearchHistoryApi
	} from '@/sub/api/search';
	import { SUCCESS_CODE } from '@/utils/request';
	import UserGoodsList from '@/components/UserGoodsList';
	import store from '@/store';
	
	let timer = null;
	
	const state = reactive({
		keyword: '',
		pageIndex: 1,
		pageSize: 10,
		historyPageIndex: 1,
		historyPageSize: 10,
		helperList: [],
		historyList: [],
		hotList: [],
		goodsList: []
	});
	
	const userInfo = computed(() => {
		return store.state.userInfo.userInfo;
	});
	
	const search = () => {
		state.helperList = [];
		getSearchGoodsList();
	};
	
	const input = () => {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			if (state.keyword !== '') {
				getSearchHelper();
			} else {
				state.helperList = [];
			}
		}, 500)
	};
	
	// 获取搜索提示词
	const getSearchHelper = () => {
		getSearchHelperApi({
			keyword: state.keyword
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.helperList = res.data;
			}
		});
	};
	
	// 获取搜索历史记录
	const getSearchHistoryList = () => {
		getSearchHistoryListApi({
			pageIndex: state.historyPageIndex,
			pageSize: state.historyPageSize
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				const arr = [];
				res.data.list.map(item => {
					arr.push(item.keyword);
				});
				// es6去重
				state.historyList = [...new Set([...arr])];
			}
		});
	};
	
	// 获取搜索结果
	const getSearchGoodsList = () => {
		getSearchGoodsListApi({
			keyword: state.keyword,
			pageIndex: state.pageIndex,
			pageSize: state.pageSize
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				const arr = [];
				res.data.list.map(item =>{
					const { brief, name, picUrl, retailPrice, id } = item;
					arr.push({
						id,
						brief,
						name,
						picUrl,
						retailPrice,
						valueId: id
					});
				});
				state.goodsList = arr;
			}
		})
	};
	
	// 获取热门关键词和推荐关键词
	const getRecommendAndHotKeyword = () => {
		getRecommendAndHotKeywordApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				const hotList = [];
				const recommnedList = [];
				res.data.hotList.map(item => {
					hotList.push(item.keyword);
				})
				res.data.recommendList.map(item => {
					recommnedList.push(item.keyword);
				});
				// es6去重
				state.hotList = [...new Set([...hotList, ...recommnedList])];
			}
		})
	}
	
	const clickHelper = data => {
		state.keyword = data;
		state.helperList = [];
	};
	
	const clickKeyword = data => {
		if (state.keyword === data) return false;
		state.keyword = data;
		getSearchGoodsList();
	};
	
	const clickEmptyHistory = () => {
		emptySearchHistoryApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				getSearchHistoryList();
			}
		})
	}
	onLoad(() => {
		getRecommendAndHotKeyword();
		if (userInfo.value.id) {
			getSearchHistoryList();
		}
	})
</script>

<style lang="scss">
	.search-history-container{
		.helper-list{
			padding: 0 $uni-padding;
			.list-item{
				padding: $uni-padding 0;
				border-bottom: 1px solid $uni-color-bd;
			}
		}
		.empty-history{
			text-align: right;
			color: $uni-color-text;
			padding: $uni-padding-half;
			font-size: $uni-font-size-sm;
		}
		.hot-list, .history-list{
			background-color: $uni-color-bg;
			padding: $uni-padding;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: wrap;
			.tip{
				font-size: $uni-font-size-sm;
			}
			.tag{
				margin-right: $uni-padding;
				padding: $uni-padding-half $uni-padding;
				background: $uni-color-base;
				color: $uni-color-white;
				font-size: $uni-font-size-base;
				margin-bottom: $uni-padding-half;
			}
		}
		.hot-list{
			border-bottom: 1px solid $uni-color-white;
		}
	}
</style>
