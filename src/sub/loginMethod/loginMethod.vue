<template>
	<view class="login-temp-container flex-center">
		<view class="btn-box w100">
			<button @click="showLogin()">账号登录</button>
			<button v-if="state.sessionId !== ''" open-type="getUserInfo" @getuserinfo="getUserInfo" type="primary">微信一键登录</button>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { reactive } from 'vue';
	import { onShow, onLoad } from '@dcloudio/uni-app';
	import { SUCCESS_CODE } from '@/utils/request';
	import { getSessionIdApi, authLoginApi }  from '@/api/user';
	
	const state = reactive({
		prevPath: '',
		sessionId: ''
	})
	
	const getUserInfo = (info: any) => {
		const wxAuth = {
			encryptedData: info.detail.encryptedData,
			iv: info.detail.iv,
			sessionId: uni.getStorageSync("sessionId")
		};
		authLoginApi(wxAuth).then(res => {
			if (res.status === SUCCESS_CODE) {
				if (state.prevPath !== '') {
					// 跳转到登录之前访问的路径
					uni.setStorage({
						key: "token",
						data: res.data.token,
						success: () => {
							uni.redirectTo({
								url: state.prevPath
							});
						}
					});
				} else {
					// 跳转到用户信息页
					uni.setStorage({
						key: "token",
						data: res.data.token,
						success: () => {
							uni.reLaunch({
								url: '../../pages/user/user?refresh=true'
							})
						}
					});
				}
				uni.setStorageSync('cartCount', res.data.cartCount);
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
						state.sessionId = result.data.sessionId;
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
		state.sessionId = '';
		uni.checkSession({
			success: data => {
				getSessionId()
			},
			fail: err => {
				getSessionId();
			}
		})
	});
	onLoad(option => {
		let params = '';
		for(let key in option) {
			if (key !== 'prevPath') {
				params += key + '=' + option[key]
			}
		}
		if (option.prevPath) {
			state.prevPath = option.prevPath + '?' + params;
		}
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
