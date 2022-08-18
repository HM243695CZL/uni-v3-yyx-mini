import {request} from '@/utils/request';
const preUrl = 'order/';

export const submitOrderInfoApi = (data: any) => {
	return request({
		url: preUrl + 'submitOrder',
		method: 'POST',
		data
	})
}

export const getOrderInfoApi = (data: any) => {
	return request({
		url: preUrl + 'getOrderInfo',
		method: 'GET',
		data
	})
}

export const payOrderApi = (data: any) => {
	return request({
		url: preUrl + 'pay',
		method: 'GET',
		data
	})
}