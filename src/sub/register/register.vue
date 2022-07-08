<template>
	<view class="register-container">
		<view class="form">
			<uni-forms ref="formRef" label-width="80px" :rules="state.rules" :modelValue="state.form">
				<uni-forms-item label="用户名" required name="username">
					<uni-easyinput v-model="state.form.username" placeholder="请输入用户名" />
				</uni-forms-item>
				<uni-forms-item label="密码" required name="password">
					<uni-easyinput v-model="state.form.password" type="password" placeholder="请输入密码" />
				</uni-forms-item>
				<uni-forms-item label="确认密码" required name="confirmPass">
					<uni-easyinput v-model="state.form.confirmPass" type="password" placeholder="请输入确认密码" />
				</uni-forms-item>
				<uni-forms-item label="手机号" required name="mobile">
					<uni-easyinput v-model="state.form.mobile" placeholder="请输入手机号" />
				</uni-forms-item>
			</uni-forms>
			<button type="primary" @click="register()">注册</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { SUCCESS_CODE } from '@/utils/request';
	import { accountRegisterApi } from '@/api/user';
	const formRef = ref();
	const state = reactive({
		form: {
			username: '',
			password: '',
			confirmPass: '',
			mobile: ''
		},
		rules: {
			username: {
				rules: [
					{ required: true, errorMessage: '用户名不能为空' }
				]
			},
			password: {
				rules: [
					{ required: true, errorMessage: '密码不能为空'}
				]
			},
			confirmPass: {
				rules: [
					{ required: true, errorMessage: '确认密码不能为空'}
				]
			},
			mobile: {
				rules: [
					{ required: true, errorMessage: '手机号不能为空'}
				]
			}
		}
	});
	const register = () => {
		formRef.value.validate(valid => {
			if (valid === null){
				uni.login({
					provider: 'weixin',
					success: res => {
						registerHandler(res.code);
					}
				})
			}
		})
	};
	const registerHandler = code => {
		accountRegisterApi({
			username: state.form.username,
			password: state.form.password,
			mobile: state.form.mobile,
			code
		}).then(res => {
			if (res.status === SUCCESS_CODE) {
				uni.setStorage({
					key: "token",
					data: res.data.token,
					success: () => {
						uni.reLaunch({
							url: '../../pages/user/user?refresh=true'
						})
					}
				});
				uni.showToast({
					title: '登录成功',
					icon: 'none'
				})
			} else {
				uni.showToast({
					icon: 'none',
					title: '登录失败，请联系管理员'
				})
			}
		})
	}
</script>

<style lang="scss">
	.register-container{
		padding: $uni-padding;
		height: 100%;
		background-color: $uni-color-white;
		box-sizing: border-box;
		.form{
			margin-top: 100rpx;
			button{
				background-color: $uni-color-base;
			}
		}
	}
</style>
