/**
 * 用户信息
 */
import { Module } from 'vuex';

const userInfo = {
	namespace: true,
	state: {
		userInfo: uni.getStorageSync('userInfo'),
		cartCount: uni.getStorageSync('cartCount')
	},
	mutations: {
		SET_USER_INFO(state, data) {
			state.userInfo = data;
		},
		SET_CART_COUNT(state, data) {
			state.cartCount = data;
		}
	},
	actions: {
		setUserInfo({commit}, data) {
			commit("SET_USER_INFO", data);
		},
		setCartCount({commit}, data) {
			commit("SET_CART_COUNT", data);
		}
	}
};

export default userInfo;