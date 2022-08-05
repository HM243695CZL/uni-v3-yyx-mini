<template>
	<view class="goods-list-container">
		<view class="goods-list-box" v-if="props.goods.length > 0">
			<view class="goods-item" v-for="item in props.goods" :key="item.id"
					@click="showGoodsInfo(item.id)"
			>
				<view class="img-pic">
					<image mode="aspectFit" :src="item.picUrl"></image>
				</view>
				<view class="title text-over">{{item.name}}</view>
				<view class="flex-between">
					<view class="price">￥{{(item.retailPrice * 100 / 100).toFixed(2)}}</view>
					<uni-icons v-if="item.isHot" color="#ff6146" type="fire" size="20"></uni-icons>
				</view>
			</view>
		</view>
		<view class="no-data" v-else>暂无数据</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	const props = defineProps({
		goods: {
			type: Array
		}
	});
	
	const showGoodsInfo = id => {
		uni.navigateTo({
			url: '/sub/goodsInfo/goodsInfo?id=' + id
		})
	}
</script>

<style lang="scss">
	.goods-list-container{
		.goods-list-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			.goods-item{
				width: 48%;
				border-radius: $uni-padding-half;
				padding: $uni-padding-half;
				box-sizing: border-box;
				margin-bottom: $uni-padding;;
				.img-pic{
					padding: $uni-padding-half;
					height: 340rpx;
					overflow: hidden;
					image{
						width: 100%;
						height: 340rpx;
						border-radius: $uni-padding-half $uni-padding-half 0 0;
					}
				}
				.title{
					padding: $uni-padding uni-padding-half;
				}
				.price{
					color: $uni-color-price;
				}
			}
		}
	}
</style>