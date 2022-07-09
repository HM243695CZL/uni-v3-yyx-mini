<template>
  <view class="content">
    首页
  </view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { SUCCESS_CODE } from '@/utils/request';
	import { getHomeGoodsApi } from '@/api/goods';
	
	const getHomeGoodsList = () => {
		getHomeGoodsApi({
			type: 0,
			pageIndex: 1,
			pageSize: 10
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				console.log(res);
			}
		})
	};
	onLoad(() => {
		getHomeGoodsList();
	})
</script>

<style>

</style>
