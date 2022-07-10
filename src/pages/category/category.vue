<template>
	<view class="category-container">
		<view class="category-list">
			<view :class="['name text-over', state.currentTab === index ? 'active' : '']" 
				@click="changeTab(item, index)"
				v-for="(item, index) in state.categoryList" :key="item.id">
				{{item.name}}
			</view>
		</view>
		<view class="goods-list">
			<GoodsList :goods="state.goodsList" />
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { SUCCESS_CODE } from '@/utils/request';
	import { getSecondCategoryApi, getGoodsByCategoryIdApi } from '@/api/category';
	import GoodsList from '@/components/GoodsList';
	const state = reactive({
		categoryList: [],
		pageIndex: 1,
		pageSize: 10,
		categoryId: null,
		currentTab: 0,
		goodsList: []
	});

	const getSecondCategory = () => {
		getSecondCategoryApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				state.categoryId = res.data[0].id;
				state.categoryList = res.data;
				getGoodsByCategoryId();
			}
		})
	};
	
	const changeTab = (item, index) => {
		if (state.currentTab === index) return false;
		state.currentTab = index;
		state.categoryId = item.id;
		getGoodsByCategoryId();
	};
	
	const getGoodsByCategoryId = () => {
		getGoodsByCategoryIdApi({
			pageIndex: state.pageIndex,
			pageSize: state.pageSize,
			categoryId: state.categoryId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.goodsList = res.data.list;
			}
		})
	}
	onLoad(() => {
		getSecondCategory();
	});
</script>


<style lang="scss">
	.category-container{
		height: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		overflow: hidden;
		.category-list{
			width: 150rpx;
			.name{
				text-align: center;
				padding: $uni-padding 0;
				border-bottom: 1px solid $uni-color-bd;
				&.active{
					color: $uni-color-base;
				}
			}
		}
		.goods-list{
			flex: 1;
			padding: $uni-padding-half;
			box-sizing: border-box;
			width: calc(100% - 150rpx);
			height: 100%;
			overflow: auto;
		}
	}
</style>
