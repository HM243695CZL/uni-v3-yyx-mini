<template>
	<view class="user-goods-list-container">
		<view class="list" v-if="props.dataList.length > 0">
			<view class="list-item flex-start" v-for="item in props.dataList" :key="item.id">
				<view class="img-goods">
					<image class="img" mode="aspectFill" :src="item.picUrl"></image>
				</view>
				<view class="desc text-over">
					<view class="name text-over">{{item.name}}</view>
					<view class="brief text-over">{{item.brief}}</view>
					<view class="price flex-between">
						￥{{item.retailPrice}}
						<uni-icons class="icon" @click="clickEmpty(item)" color="#ff6146" type="closeempty" size="20"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-box" v-if="props.dataList.length > 0" @click="emptyAll()">
			<view class="btn">清空全部</view>
		</view>
		<view class="no-data" v-else>暂无数据</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import {emptyFootprintApi} from '@/api/footprint';
	import {emptyCollectionApi} from '@/api/collection';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const props = defineProps({
		dataList: {
			type: Array,
			default: () => []
		},
		type: {
			type: String,
			required: true
		},
		selectedIds: []
	});
	
	const emit = defineEmits('refresh-list')
	
	const state = reactive({
		
	});
	
	const emptyFootprint = () => {
		emptyFootprintApi(state.selectedIds).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.showToast({
					icon: 'success',
				});
				emit('refresh-list');
			}
		})
	};
	
	const emptyCollection = () => {
		emptyCollectionApi(state.selectedIds).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.showToast({
					icon: 'success',
				});
				emit('refresh-list');
			}
		})
	};
	
	const clickEmpty = data => {
		state.selectedIds = [data.id];
		operateFun();
	};
	
	const emptyAll = () => {
		const arr = [];
		props.dataList.map(item => {
			arr.push(item.id);
		});
		state.selectedIds = arr;
		operateFun();
	};
	
	const operateFun = () => {
		if (props.type === 'footprint') {
			emptyFootprint();
		}
		if (props.type === 'collection') {
			emptyCollection();
		}
	};
</script>

<style lang="scss">
	.user-goods-list-container{
		background-color: $uni-color-bg;
		height: 100%;
		.list{
			.list-item{
				margin-bottom: $uni-padding-half;
				padding: $uni-padding;
				background-color: $uni-color-white;
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
		.btn-box{
			margin-top: $uni-padding;
			padding: $uni-padding;
			.btn{
				border-radius: 10rpx;
				padding: $uni-padding 0;
				text-align: center;
				background-color: $uni-color-base;
				color: $uni-color-white;
			}
		}
	}
</style>