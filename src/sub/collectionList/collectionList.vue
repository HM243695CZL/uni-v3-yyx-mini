<template>
	<UserGoodsList :dataList="state.dataList"></UserGoodsList>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getCollectionListApi } from '@/api/collection';
	import UserGoodsList from '@/components/UserGoodsList';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		dataList: []
	});
	
	const getCollectionList = () => {
		getCollectionListApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				state.dataList = res.data;
			}
		})
	};
	onLoad(() => {
		getCollectionList();
	})
</script>

<style lang="scss">
	
</style>
