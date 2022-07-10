<template>
  <view class="index-content">
    <view class="tab-bar">
		<view 
		:class="['item', state.current === index ? 'active': '']"
		 v-for="(item, index) in state.tabBarList" :key="item"
		 @click="changeTabBar(index)"
		 >{{item}}</view>
	</view>
	<view class="goods-box">
		<GoodsList :goods="state.dataList" />
	</view>
  </view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { SUCCESS_CODE } from '@/utils/request';
	import { getHomeGoodsApi } from '@/api/goods';
	import GoodsList from '@/components/GoodsList';
	
	const state = reactive({
		tabBarList: ['默认', '最新', '价格'],
		current: 0,
		dataList: []
	})
	
	const getHomeGoodsList = () => {
		getHomeGoodsApi({
			type: state.current,
			pageIndex: 1,
			pageSize: 10
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				state.dataList = res.data.list;
			}
		})
	};
	
	const changeTabBar = index => {
		if (state.current === index) return false;
		state.current = index;
		getHomeGoodsList();
	}
	onLoad(() => {
		getHomeGoodsList();
	})
</script>

<style lang="scss">
	.index-content{
		height: 100%;
		.tab-bar{
			display: flex;
			justify-content: space-between;
			align-items: center;
			.item{
				flex: 1;
				padding: $uni-padding-half;
				text-align: center;
				&.active{
					color: $uni-color-base;
				}
			}
		}
		.goods-box{
			padding: $uni-padding-half;
			height: calc(100% - 95rpx);
			overflow: auto;
		}
	}
</style>
