<template>
	<UserGoodsList :dataList="state.dataList" type="footprint" @refresh-list="getFootprintList()"></UserGoodsList>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getFootprintListApi } from '@/api/footprint';
	import UserGoodsList from '@/components/UserGoodsList';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const state = reactive({
		dataList: []
	});
	
	const getFootprintList = () => {
		getFootprintListApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				state.dataList = res.data;
			}
		})
	};
	
	onLoad(() => {
		getFootprintList();
	})
</script>

<style>

</style>
