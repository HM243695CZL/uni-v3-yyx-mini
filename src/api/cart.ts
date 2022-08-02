import {request} from '@/utils/request';
const preUrl = 'cart/';

export const saveCartApi = (data: any) => {
	return request({
		url: preUrl + 'create',
		method: 'POST',
		data
	})
}

export const getCartInfoApi = () => {
	return request({
		url: preUrl + 'getCartInfo',
		method: 'POST'
	})
}