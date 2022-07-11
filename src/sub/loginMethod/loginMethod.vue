<template>
	<view class="login-temp-container flex-center">
		<view class="btn-box w100">
			<button @click="showLogin()">账号登录</button>
			<button open-type="getUserInfo" @getuserinfo="getUserInfo" type="primary">微信一键登录</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { onShow } from '@dcloudio/uni-app';
	import { SUCCESS_CODE } from '@/utils/request';
	import { getSessionIdApi, authLoginApi }  from '@/api/user';
	const getUserInfo = (info) => {
		const wxAuth = {
			encryptedData: info.detail.encryptedData,
			iv: info.detail.iv,
			sessionId: uni.getStorageSync("sessionId")
		};
		authLoginApi(wxAuth).then(res => {
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
					title: '微信登录失败，请联系管理员'
				})
			}
		})
	};
	const getSessionId = () => {
		uni.login({
			provider: "weixin",
			success: res => {
				getSessionIdApi({
					code: res.code
				}, false).then(result => {
					if (result.status === SUCCESS_CODE) {
						uni.setStorageSync('sessionId', result.data.sessionId);
					}
				})
			}
		})
	};
	const showLogin = () => {
		uni.navigateTo({
			url: '/sub/login/login'
		})
	};
	onShow(() => {
		uni.checkSession({
			success: data => {
				getSessionId()
			},
			fail: err => {
				getSessionId();
			}
		})
	})
</script>

<style lang="scss">
	.login-temp-container{
		.btn-box{
			margin-top: 100rpx;
			padding: $uni-padding;
			button{
				color: $uni-color-white;
				background-color: $uni-color-base;
				margin-bottom: 50rpx;
			}
		}
	}
</style>
