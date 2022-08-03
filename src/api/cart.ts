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

export const changeCheckedApi = (data: any) => {
	return request({
		url: preUrl + 'checked',
		method: 'POST',
		data
	})
}

export const emptyCartApi = (data: any) => {
	return request({
		url: preUrl + 'emptyCart',
		method: 'POST',
		data
	})
}

export const fastAddApi = (data: any) => {
	return request({
		url: preUrl + 'fastAdd',
		method: 'POST',
		data
	})
}