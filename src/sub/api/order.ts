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

export const getOrderListApi = (data: any) => {
	return request({
		url: preUrl + 'getOrderList',
		method: 'POST',
		data
	})
}

export const cancelOrderApi = (data: any) => {
	return request({
		url: preUrl + 'cancel',
		method: 'GET',
		data
	})
}

export const refundOrderApi = (data: any) => {
	return request({
		url: preUrl + 'applyRefund',
		method: 'POST',
		data
	})
}

export const receiveOrderApi = (data: any) => {
	return request({
		url: preUrl + 'confirm',
		method: 'GET',
		data
	})
}

export const deleteOrderApi = (data: any) => {
	return request({
		url: preUrl + 'delete',
		method: 'GET',
		data
	})
}

export const getOrderGoodsInfoApi = (data: any) => {
	return request({
		url: preUrl + 'orderGoods',
		method: 'GET',
		data
	})
}

export const commentOrderGoodsApi = (data: any) => {
	return request({
		url: preUrl + 'comment',
		method: 'POST',
		data
	})
}

export const afterSaleOrderApi = (data: any) => {
	return request({
		url: preUrl + 'afterSale',
		method: 'POST',
		data
	})
}