<template>
	<view class="cart-bar-container" :style="props.isFixed ? state.cartStyle : {}">
		<uni-goods-nav :options="props.isFixed ? state.options : []" :fill="true" 
			:button-group="state.buttonGroup" @click="onClick"
			@buttonClick="buttonClick" 
		/>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	const props = defineProps({
		isFixed: {
			type: Boolean,
			default: true
		}
	})
	const state = reactive({
		cartStyle: {
			position: 'fixed',
			bottom: 0,
			left: 0,
			right: 0
		},
		options: [
			{
				icon: 'star',
				text: '收藏'
			}, 
			{
				icon: 'cart',
				text: '购物车',
			},
		],
		buttonGroup: [
			{
				text: '加入购物车',
				backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
				color: '#fff'
			},
			{
				text: '立即购买',
				backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
				color: '#fff'
			}
		],
	});
	
	const onClick = e => {
		console.log(e);
	};
	
	const buttonClick = e => {
		console.log(e);
	}
</script>


<style lang="scss">
	
</style>