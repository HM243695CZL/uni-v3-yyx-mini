<template>
	<view class="user-goods-list-container">
		<view class="list">
			<view class="list-item flex-start" v-for="item in props.dataList" :key="item.id">
				<view class="img-goods">
					<image class="img" mode="aspectFill" :src="item.picUrl"></image>
				</view>
				<view class="desc text-over">
					<view class="name text-over">{{item.name}}</view>
					<view class="brief text-over">{{item.brief}}</view>
					<view class="price">￥{{item.retailPrice}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	
	const props = defineProps({
		dataList: {
			type: Array,
			default: () => []
		}
	})
</script>

<style lang="scss">
	.user-goods-list-container{
		background-color: $uni-color-bg;
		height: 100%;
		.list{
			.list-item{
				padding: $uni-padding;
				background-color: $uni-color-white;
				margin-bottom: $uni-padding-half;
				.img-goods{
					.img{
						width: 150rpx;
						height: 150rpx;
					}
				}
				.desc{
					flex: 1;
					padding-left: $uni-padding;
					.name{
						font-weight: bold;
						margin-bottom: $uni-padding-half;
					}
					.brief{
						color: $uni-color-9;
						margin-bottom: $uni-padding-half;
					}
					.price{
						color: $uni-color-price;
					}
				}
			}
		}
	}
</style>