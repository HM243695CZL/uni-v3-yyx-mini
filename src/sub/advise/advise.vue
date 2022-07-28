<template>
	<view class="advice-container">
		<view class="form w100">
			<uni-forms ref="formRef" :rules="state.rules" :modelValue="state.form" labelWidth="80px">
				<uni-forms-item label="反馈类型" required name="feedType">
					<picker mode="selector" :range="state.feedTypeList" @change="changeFeedType">
						<view class="feed-value flex-between">
							<view>{{state.form.feedType === '' ? '请选择反馈类型' : state.form.feedType}}</view>
							<uni-icons type="bottom" size="20"></uni-icons>
						</view>
					</picker>
				</uni-forms-item>
				<uni-forms-item label="建议" required name="content">
					<uni-easyinput type="textarea" v-model="state.form.content"
						placeholder="对网站、商品的建议，需要在商城中买到什么？请告诉我们..."
						maxlength="500"
						autoHeight
					></uni-easyinput>
				</uni-forms-item>
				<uni-forms-item label="图片" name="picUrls">
					<uni-file-picker
						limit="4" 
						v-model="state.form.picUrls" 
						:imageStyles="state.imageStyle" 
						file-mediatype="image"
						file-extname="png,jpg"
						@select="selectImg" 
					></uni-file-picker>
				</uni-forms-item>
				<uni-forms-item label="手机号码" required name="mobile">
					<uni-easyinput v-model="state.form.mobile" placeholder="方便我们与您联系" />
				</uni-forms-item>
			</uni-forms>
			<button type="primary" @click="confirm()">提交</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import {policyApi} from '@/api/oss';
	import {saveFeedbackApi} from '@/api/feedback';
	import { SUCCESS_CODE } from '@/utils/request';
	
	const formRef = ref();
	const state = reactive({
		form: {
			feedType: '',
			content: '',
			hasPicture: false,
			picUrls: [],
			mobile: '',
		},
		rules: {
			feedType: {
				rules: [
					{ required: true, errorMessage: '请选择反馈类型'}
				]
			},
			content: {
				rules: [
					{ required: true, errorMessage: '请输入反馈内容'}
				]
			},
			mobile: {
				rules: [
					{ required: true, errorMessage: '手机号不能为空'}
				]
			}
		},
		feedTypeList: ['商品相关', '功能异常', '优化建议', '其他'],
		imageStyle: {
			width: 100,
			height: 100
		},
		dataObj: {
			policy: '',
			signature: '',
			key: '',
			ossAccessKeyId: '',
			dir: '',
			host: ''
		},
	});
	
	const changeFeedType = e => {
		state.form.feedType = state.feedTypeList[e.detail.value];
	};
	
	const confirm = () => {
		formRef.value.validate(valid => {
			if (valid === null) {
				state.form.hasPicture = state.form.picUrls.length > 0;
				state.form.picUrls = JSON.stringify(state.form.picUrls);
				saveFeedbackApi(state.form).then(res => {
					if (res.status === SUCCESS_CODE) {
						uni.showToast({
							icon: 'success'
						});
						uni.navigateBack();
					}
				})
			}
		})
	};
	
	const selectImg = e => {
		let fileList = e.tempFiles;
		policyApi().then(res => {
			if (res.status === SUCCESS_CODE) {
				const {accessKeyId, dir, host, policy, signature} = res.data;
				state.dataObj.policy = policy;
				state.dataObj.signature = signature;
				state.dataObj.key = dir + '/${filename}';
				state.dataObj.ossAccessKeyId = accessKeyId;
				state.dataObj.dir = dir;
				state.dataObj.host = host;
				for (let i = 0; i < fileList.length; i++) {
					uni.uploadFile({
						url: host,
						filePath: fileList[i].path,
						name: 'file',
						fileType: 'image',
						formData: state.dataObj,
						success: result => {
							state.form.picUrls.push(state.dataObj.host + '/' + state.dataObj.dir + '/' + fileList[i].name)
						}
					})
				}
			}
		})
	}
</script>

<style lang="scss">
	.advice-container{
		padding: $uni-padding;
		height: 100%;
		background-color: $uni-color-white;
		box-sizing: border-box;
		.form{
			.feed-value{
				margin-top: 18rpx;
			}
			button{
				color: $uni-color-white;
				background-color: $uni-color-base;
			}
			.form-bottom{
				margin-top: $uni-padding;
				font-size: $uni-font-size-sm;
			}
		}
	}
</style>