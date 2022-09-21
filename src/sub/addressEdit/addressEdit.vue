<template>
	<view class="address-edit-container">
		<view class="form w100">
			<uni-forms ref="formRef" :rules="state.rules" :modelValue="state.form" labelWidth="80px">
				<uni-forms-item label="姓名" required name="name">
					<uni-easyinput v-model="state.form.name" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item label="手机号码" required name="tel">
					<uni-easyinput v-model="state.form.tel" placeholder="请输入手机号码" type="number" />
				</uni-forms-item>
				<uni-forms-item label="省市区" required name="address" class="text-over" >
					<uni-data-picker 
						placeholder="请选择省份、城市、区县"
						popup-title="请选择省份、城市、区县" 
						:localdata="state.areaTree" 
						v-model="state.form.address"
						:map="state.map"
						@change="changeAddress" 
					>
					</uni-data-picker>
				</uni-forms-item>
				<uni-forms-item label="详情地址" required name="addressDetail">
					<uni-easyinput v-model="state.form.addressDetail" placeholder="请输入详情地址" />
				</uni-forms-item>
				<uni-forms-item label="默认地址" required name="isDefault">
					<uni-data-checkbox v-model="state.form.isDefault"
					 :localdata="state.typeList" 
					 selectedColor="#36c1ba"
					 selectedTextColor="#36c1ba"
					 />
				</uni-forms-item>
			</uni-forms>
			<view class="btn-box flex-between">
				<view class="cancel-btn" @click="clickCancel()">取消</view>
				<view class="confirm-btn" @click="clickConfirm()">保存</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { saveAddressApi } from '@/sub/api/address';
	import { getRegionListApi} from '@/sub/api/region';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const formRef = ref();
	const state = reactive({
		form: {
			name: '',
			tel: '',
			address: '',
			province: '',
			city: '',
			county: '',
			addressDetail: '',
			isDefault: 0
		},
		rules: {
			name: {
				rules: [
					{ required: true, errorMessage: '姓名不能为空'}
				]
			},
			tel: {
				rules: [
					{ required: true, errorMessage: '手机号码不能为空'}
				]
			},
			addressDetail: {
				rules: [
					{ required: true, errorMessage: '详细地址不能为空'}
				]
			}
		},
		typeList: [
			{ text: '是', value: 1},
			{ text: '否', value: 0}
		],
		areaTree: [],
		map: {
			text: 'value',
			value: 'value'
		}
	});
	
	const changeAddress = e => {
		state.form.province = e.detail.value[0].value;
		state.form.city = e.detail.value[1].value;
		state.form.county = e.detail.value[2].value;
	};
	
	const clickCancel = () => {
		uni.navigateBack();
	};
	
	const clickConfirm = () => {
		formRef.value.validate(valid => {
			if (valid === null) {
				saveAddressApi(state.form).then(res => {
					if (res.status === SUCCESS_CODE) {
						uni.showToast({
							icon: 'success'
						});
						clickCancel();
					}
				})
			}
		})
	};
	
	const getRegionList = () => {
		getRegionListApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				state.areaTree = res.data;
				uni.setStorage({
					key : 'regionList',
					data: res.data
				});
			}
		})
	};
	
	onLoad(() => {
		const regionList = uni.getStorageSync('regionList');
		if (regionList === '') {
			getRegionList();
		} else {
			state.areaTree = regionList;
		}
	})
</script>

<style lang="scss">
	.address-edit-container{
		padding: $uni-padding;
		height: 100%;
		background-color: $uni-color-white;
		box-sizing: border-box;
		.form{
			margin-top: $uni-padding;
			button{
				color: $uni-color-white;
				background-color: $uni-color-base;
			}
			.btn-box{
				margin-top: $uni-padding;
				padding: $uni-padding;
				.cancel-btn{
					flex: 1;
					padding: $uni-padding-half;
					text-align: center;
					background-color: #f56c6c;
					color: $uni-color-white;
					border-radius: 10rpx 0 0 10rpx;
				}
				.confirm-btn{
					flex: 1;
					padding: $uni-padding-half;
					text-align: center;
					background-color: $uni-color-base;
					color: $uni-color-white;
					border-radius: 0 10rpx 10rpx 0;
				}
			}
		}
	}
</style>