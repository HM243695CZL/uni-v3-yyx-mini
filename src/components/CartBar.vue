<template>
	<view class="cart-bar-container" :style="props.isFixed ? state.cartStyle : {}">
		<uni-goods-nav :options="props.isFixed ? state.options : []" :fill="true" 
			:button-group="state.buttonGroup" @click="onClick"
			@buttonClick="buttonClick" 
		/>
		<uni-popup ref="collectionDialog" type="dialog">
			<uni-popup-dialog cancelText="取消" confirmText="去登录" title="提示" @confirm="clickConfirm">
				您还未登录
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, computed } from 'vue';
	import store from '@/store';
	const props = defineProps({
		isFixed: {
			type: Boolean,
			default: true
		},
		prevPath: {
			type: String,
			default: ''
		}
	});
	const collectionDialog = ref();
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
	const userInfo = computed(() => {
		return store.state.userInfo.userInfo;
	});
	const onClick = e => {
		if (e.index === 0) {
			// 点击收藏
			if (!userInfo.value.id) {
				collectionDialog.value.open();
			}
		}
	};
	const clickConfirm = () => {
		const params = props.prevPath.split('?')[1];
		uni.redirectTo({
			url: '/sub/loginMethod/loginMethod?prevPath=' + props.prevPath.split('?')[0] + '&' + params
		})
	};
	
	const buttonClick = e => {
		console.log(e);
	}
</script>


<style lang="scss">
	
</style>