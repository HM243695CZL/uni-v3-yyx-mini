/**
 * 用户信息
 */
import { Module } from 'vuex';

const userInfo = {
	namespace: true,
	state: {
		userInfo: uni.getStorageSync('userInfo')
	},
	mutations: {
		SET_USER_INFO(state, data) {
			state.userInfo = data;
		}
	},
	actions: {
		setUserInfo({commit}, data) {
			commit("SET_USER_INFO", data);
		}
	}
};

export default userInfo;