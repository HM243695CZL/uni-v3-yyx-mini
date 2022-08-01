<template>
	<view class="choose-specifition">
		<uni-popup ref="popupRef" background-color="#fff">
			<view class="specifitoin-container">
				<view class="goods-desc flex-start">
					<image class="img-goods" mode="aspectFill" :src="props.info.goods.picUrl"></image>
					<view class="info">
						<text class="price">￥{{state.currentPrice}}</text>
						<text class="tip">
							<text v-if="state.typeName.length === state.unselectedName.length">
								请选择 <text class="tag" v-for="item in state.typeName" :key="item">{{item}}</text>
							</text>
							<text v-if="state.unselectedName.length < state.typeName.length && state.unselectedName.length > 0">
								请选择 <text class="tag" v-for="item in state.unselectedName" :key="item">{{item}}</text>
							</text>
							<text v-if="state.unselectedName.length === 0">
								已选 <text class="tag" v-for="item in state.selectedShowValue" :key="item">{{item}}</text>
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
									:class="['tag', 
									state.selectedShowValue.includes(ele.value) ? 'active' : '', 
									state.disabledName.includes(ele.value) ? 'disabled' : '']"
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
				<CartBar :goodsId="props.info.goods.id" :is-fixed="false"
					:buy-count="state.buyCount"
					:product-id="state.productId"
				 />
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
		selectedShowValue: [], // 显示在页面中的值
		unselectedName: [], // 未选规格名称
		disabledName: [], // 禁止选择的规格 数量为0时
		currentPrice: '', // 当前选中规格的价格
		buyCount: 1, // 购买数量
		productId: '', // 选中的规格id
	});
	const initData = () => {
		state.typeName = [];
		state.selectedName = [];
		state.selectedValue = [];
		state.selectedShowValue = [];
		state.unselectedName = [];
		state.disabledName = [];
		let disArr = [];
		let arr = [];
		props.info.products.map(item => {
			if (item.number > 0) {
				arr = [...JSON.parse(item.specifications)]
			} else {
				disArr = JSON.parse(item.specifications);
			}
		});
		disArr.map(item => {
			if (!arr.includes(item)) {
				state.disabledName.push(item);
			}
		});
		props.info.specificationList.map(item => {
			state.typeName.push(item.name);
			state.unselectedName.push(item.name);
			state.selectedValue.push({
				name: item.name,
				value: []
			})
		});
	};
	const changeSpecification = (index, ele) => {
		if (state.disabledName.includes(ele.value)) return false;
		if (state.selectedName.includes(ele.specification)) {
			// 已选
			if (state.selectedValue[index].value[0] === ele.value) {
				// 删除当前值   取消选中
				state.selectedValue[index].value = [];
				state.selectedName.map((item, i) => {
					if (item === ele.specification) {
						state.selectedName.splice(i, 1);
					}
				});
				// 将当前数据添加到未选
				state.unselectedName.push(ele.specification);
			} else {
				// 切换选中项
				state.selectedValue[index].value = [];
				state.selectedValue[index].value.push(ele.value)
			}
		} else {
			// 未选   选中当前
			state.selectedName.push(ele.specification);
			// 添加当前值
			state.selectedValue[index].value.push(ele.value);
			// 将当前数据从未选中删除
			state.unselectedName.map((item, i) => {
				if (item === ele.specification) {
					state.unselectedName.splice(i, 1);
				}
			})
		}
		const valueArr = [];
		state.selectedValue.map(item => {
			item.value.map(ele => {
				valueArr.push(ele);
			})
		});
		state.selectedShowValue = valueArr;
		// 设置规格价格
		let priceIndex = null
		props.info.products.map((item, i) => {
			if (item.specifications === JSON.stringify(valueArr)) {
				priceIndex = i;
				state.productId = item.id;
			}
		});
		if (priceIndex !== null) {
			state.currentPrice = props.info.products[priceIndex].price;
		} else {
			state.currentPrice = '';
		}
	};
	const changeBuyCount = value => {
		state.buyCount = value;
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
							border-radius: $uni-padding-half;
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