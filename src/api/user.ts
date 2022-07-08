import {request} from '@/utils/request';

export const getSessionIdApi = (data, status) => {
	return request({
		url: 'cms/user/getSessionId',
		method: 'get',
		data
	}, status)
}

export const authLoginApi = data => {
	return request({
		url: 'cms/user/loginByWeixin',
		method: 'post',
		data
	})
}

export const getUserInfoApi = data => {
	return request({
		url: 'cms/user/getUserInfo?refresh=' + data.refresh,
		method: 'get'
	})
}