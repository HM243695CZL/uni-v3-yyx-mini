<template>
	<view class="login-container">
		<view class="form w100">
			<uni-forms ref="form" :rules="state.rules" :modelValue="state.form">
				<uni-forms-item label="账号" required name="username">
					<uni-easyinput v-model="state.form.username" placeholder="请输入账号" />
				</uni-forms-item>
				<uni-forms-item label="密码" required name="password">
					<uni-easyinput v-model="state.form.password" type="password" placeholder="请输入密码" />
				</uni-forms-item>
			</uni-forms>
			<button type="primary" @click="clickLogin()">登录</button>
			<view class="form-bottom flex-between">
				<text class="register" @click="showRegister()">注册账号</text>
				<text class="forget">忘记密码</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { SUCCESS_CODE } from '@/utils/request';
	import { accountLoginApi } from '@/api/user';
	const state = reactive({
		form: {
			username: '',
			password:''
		},
		rules: {
			username: {
				rules: [
					{ required: true, errorMessage: '账号不能为空'}
				]
			},
			password: {
				rules: [
					{ required: true, errorMessage: '密码不能为空' }
				]
			}
		}
	});
	const clickLogin = () => {
		accountLoginApi({
			username: state.form.username,
			password: state.form.password
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
				uni.setStorageSync('cartCount', res.data.cartCount);
				uni.showToast({
					title: '登录成功',
					icon: 'none'
				});
			}  else {
				uni.showToast({
					icon: 'none',
					title: '登录失败，请联系管理员'
				})
			}
		})
	};
	const showRegister = () => {
		uni.navigateTo({
			url: '/sub/register/register'
		});
	};
</script>

<style lang="scss">
	.login-container{
		padding: $uni-padding;
		height: 100%;
		background-color: $uni-color-white;
		box-sizing: border-box;
		.form{
			margin-top: 100rpx;
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
