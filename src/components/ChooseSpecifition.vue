<template>
	<view class="choose-specifition">
		<uni-popup ref="popupRef" background-color="#fff">
			<view class="specifitoin-container">
				<view class="goods-desc flex-start">
					<image class="img-goods" mode="aspectFill" :src="props.info.goods.picUrl"></image>
					<view class="info">
						<text class="price">￥99</text>
						<text class="tip">
							<text v-if="state.unselectedName.length === 0">
								请选择 <text class="tag" v-for="item in state.typeName" :key="item">{{item}}</text>
							</text>
							<text v-else-if="state.typeName.length === state.selectedName.length">
								已选 <text class="tag" v-for="item in state.selectedValue" :key="item">{{item}}</text>
							</text>
							<text v-else>
								请选择1 <text class="tag" v-for="item in state.unselectedName" :key="item">{{item}}</text>
							</text>
						</text>
					</view>
				</view>
				<view class="specification-box">
					<view class="specification-list">
						<view class="specification-item" v-for="(item, index) in props.info.specificationList" :key="item.name">
							<view class="name">{{item.name}}</view>
							<view class="value-list">
								<text @click="changeSpecification(index, ele)" 
									:class="['tag', state.selectedValue[index].value.includes(ele.value) ? 'active' : '']"
									 v-for="(ele, i) in item.valueList" :key="ele.id">
								 {{ele.value}}
								 </text>
							</view>
						</view>
					</view>
				</view>
				<view class="buy-count flex-between">
					<text class="txt">购买数量</text>
					<uni-number-box @change="changeBuyCount" />
				</view>
				<CartBar :is-fixed="false" />
			</view>
		</uni-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import CartBar from '@/components/CartBar';
	
	const props = defineProps({
		info: {
			type: Object
		}
	});
	const state = reactive({
		typeName: [], // 可选规格名称
		selectedName: [], // 已选规格名称
		selectedValue: [], // 已选规格值
		unselectedName: [], // 未选规格名称
	});
	const initData = () => {
		state.typeName = [];
		state.selectedValue = [];
		props.info.specificationList.map(item => {
			state.typeName.push(item.name);
			state.selectedValue.push({
				name: item.name,
				value: []
			})
		});
	};
	const changeSpecification = (index, ele) => {
		if (!state.selectedValue[index].value.includes(ele.value)) {
			state.selectedValue[index].value = [];
			state.selectedValue[index].value.push(ele.value);
			state.selectedName.push(ele.value);
		} else {
			state.selectedValue[index].value = [];
		}
		state.selectedValue.map((e, i) => {
			if (e.value.length === 0 && !state.unselectedName.includes(e.name)) {
				state.unselectedName.push(e.name);
			}
		});
	};
	const changeBuyCount = value => {
		console.log(value)
	};
	const popupRef = ref();
	const openPopup = () => {
		popupRef.value.open('bottom');
		initData();
	};
	defineExpose({
		openPopup
	});
</script>

<style lang="scss">
	.specifitoin-container{
		padding: $uni-padding;
		font-size: $uni-font-size-base;
		.goods-desc{
			display: flex;
			justify-content: flex-start;
			align-items: flex-end;
			padding-bottom: $uni-padding;
			border-bottom: 1px solid $uni-color-bd;
			.img-goods{
				width: 150rpx;
				height: 150rpx;
			}
			.info{
				display: flex;
				justify-content: flex-end;
				align-items: flex-start;
				flex-direction: column;
				padding-left: $uni-padding;
				.price{
					color: $uni-color-price;
					color: $uni-font-size-lg;
					margin-bottom: $uni-padding-half;
				}
				.tip{
					color: $uni-color-9;
					.tag{
						padding: $uni-padding-half;
					}
				}
			}
		}
		.specification-box{
			.specification-list{
				.specification-item{
					padding-top: $uni-padding-half;
					padding-bottom: $uni-padding;
					border-bottom: 1px solid $uni-color-bd;
					.name{
						font-weight: bold;
					}
					.value-list{
						margin-top: $uni-padding;
						.tag{
							padding: $uni-padding-half;
							background-color: $uni-color-bg;
							margin-right: $uni-padding-half;
							&.active{
								color: $uni-color-white;
								background-color: $uni-color-base;
							}
						}
					}
				}
			}
		}
		.buy-count{
			padding: $uni-padding 0;
		}
	}
</style>