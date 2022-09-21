import {request} from '@/utils/request';
const preUrl = 'cms/user/';
export const getSessionIdApi = (data: any, status: boolean) => {
	return request({
		url: preUrl + 'getSessionId',
		method: 'GET',
		data
	}, status)
}

export const authLoginApi = (data: any) => {
	return request({
		url: preUrl + 'loginByWeixin',
		method: 'POST',
		data
	})
}

export const getUserInfoApi = (data: any) => {
	return request({
		url: preUrl + 'getUserInfo?refresh=' + data.refresh,
		method: 'GET'
	})
}

export const accountRegisterApi = (data: any) => {
	return request({
		url: preUrl + 'register',
		method: 'POST',
		data
	})
}

export const accountLoginApi = (data: any) => {
	return request({
		url: preUrl + 'accountLogin',
		method: 'post',
		data
	})
}