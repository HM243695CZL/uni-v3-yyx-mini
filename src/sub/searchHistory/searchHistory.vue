<template>
	<view class="search-history-container">
		<uni-search-bar class="uni-mt-10" radius="5"
			v-model="state.keyword"
			placeholder="请输入商品名称" 
			clearButton="auto" cancelButton="none" @confirm="search" 
			@input="input"
		/>
		<view class="helper-list">
			<view class="list-item" v-for="item in state.helperList" :key="item" @click="clickHelper(item)">
				{{item}}
			</view>
		</view>
		<view class="history-list flex-start">
			<text class="tag" v-for="item in state.historyList" :key="item.id">
				{{item.keyword}}
			</text>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import {onLoad} from '@dcloudio/uni-app';
	import {getSearchHelperApi, getSearchHistoryListApi, getSearchGoodsListApi} from '@/api/search';
	import { SUCCESS_CODE } from '@/utils/request';
	
	let timer = null;
	
	const state = reactive({
		keyword: '',
		pageIndex: 1,
		pageSize: 10,
		historyPageIndex: 1,
		historyPageSize: 10,
		helperList: [],
		historyList: []
	})
	
	const search = value => {
		state.helperList = [];
		getSearchGoodsList();
	};
	
	const input = value => {
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
	
	const getSearchHelper = () => {
		getSearchHelperApi({
			keyword: state.keyword
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.helperList = res.data;
			}
		});
	};
	
	const getSearchHistoryList = () => {
		getSearchHistoryListApi({
			pageIndex: state.historyPageIndex,
			pageSize: state.historyPageSize
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.historyList = res.data.list;
			}
		});
	};
	
	const getSearchGoodsList = () => {
		getSearchGoodsListApi({
			keyword: state.keyword,
			pageIndex: state.pageIndex,
			pageSize: state.pageSize
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				console.log(res);
			}
		})
	};
	
	const clickHelper = data => {
		state.keyword = data;
		state.helperList = [];
	};
	
	onLoad(() => {
		getSearchHistoryList();
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
		.history-list{
			padding: $uni-padding;
			.tag{
				margin-right: $uni-padding;
				padding: $uni-padding-half $uni-padding;
				background: $uni-color-base;
				color: $uni-color-white;
			}
		}
	}
</style>
