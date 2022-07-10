<template>
	<view>
		商品信息
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getGoodsInfoApi } from '@/api/goods';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		goodsId: null
	})
	
	const getGoodsInfo = () => {
		getGoodsInfoApi({
			goodsId: state.goodsId
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				console.log(res);
			}
		})
	}
	
	onLoad(option => {
		state.goodsId = option.id;
		getGoodsInfo();
	})
</script>

<style>

</style>
