<template>
	<div class="my-order-list-container">
		我的订单列表
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	
	onLoad(ops => {
		console.log(ops)
	})
</script>

<style>
</style>