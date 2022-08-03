<template>
	<view class="write-order-container">
		<view class="address-item">
			<view class="address-info">
				<view class="txt">收货地址</view>
				<view class="info">
					<view class="connect-user">
						hl243695czyn
						<text class="phone">17885201345</text>
					</view>
					<view class="detail-address">岩鱼村</view>
				</view>
			</view>
			<uni-icons class="icon" type="right" size="20"></uni-icons>
		</view>
		填写订单
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { getShoppingOrderApi } from '@/api/cart';
	import { SUCCESS_CODE } from '@/utils/request';
	
	
	const state = reactive({
		cartIds: []
	});
	
	const getShoppingOrder = () => {
		getShoppingOrderApi(state.cartIds).then(res => {
			if (res.status === SUCCESS_CODE) {
				console.log(res);
			}
		})
	}
	
	onLoad(ops => {
		state.cartIds = ops.cartIds.split(',');
		getShoppingOrder();
	})
</script>

<style lang="scss">
	.write-order-container{
		background-color: $uni-color-bg;
		height: 100%;
		.address-item{
			padding: $uni-padding;
			margin-bottom: $uni-padding-half;
			background: $uni-color-white;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			.address-info{
				display: flex;
				justify-content: flex-start;
				align-items: flex-start;
				flex-direction: column;
				.info{
					margin-top: $uni-padding-half;
					color: $uni-color-9;
					.phone{
						margin-left: $uni-padding-half;
					}
				}
			}
		}
	}
</style>