<template>
	<view class="advice-container">
		<view class="form w100">
			<uni-forms ref="form" :rules="state.rules" :modelValue="state.form" labelWidth="80px">
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
					></uni-file-picker>
				</uni-forms-item>
				<uni-forms-item label="手机号码" name="mobile">
					<uni-easyinput v-model="state.form.mobile" placeholder="方便我们与您联系" />
				</uni-forms-item>
			</uni-forms>
			<button type="primary" @click="confirm()">提交</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	
	const state = reactive({
		form: {
			feedType: '',
			content: '',
			hasPicture: false,
			picUrls: [],
			mobile: '',
		},
		rules: {},
		feedTypeList: ['商品相关', '功能异常', '优化建议', '其他'],
		imageStyle: {
			width: 100,
			height: 100
		}
	});
	
	const changeFeedType = e => {
		state.form.feedType = state.feedTypeList[e.detail.value];
	};
	
	const confirm = () => {
		console.log(state.form);
	};
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