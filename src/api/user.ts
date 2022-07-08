import {request} from '@/utils/request';
const preUrl = 'cms/user/';
export const getSessionIdApi = (data, status) => {
	return request({
		url: preUrl + 'getSessionId',
		method: 'get',
		data
	}, status)
}

export const authLoginApi = data => {
	return request({
		url: preUrl + 'loginByWeixin',
		method: 'post',
		data
	})
}

export const getUserInfoApi = data => {
	return request({
		url: preUrl + 'getUserInfo?refresh=' + data.refresh,
		method: 'get'
	})
}

export const accountRegisterApi = data => {
	return request({
		url: preUrl + 'register',
		method: 'post',
		data
	})
}