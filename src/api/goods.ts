import {request} from '@/utils/request';
const preUrl = 'home/';
const preGoodsUrl = 'goods/'

export const getHomeGoodsApi = (data: any) => {
	return request({
		url: preUrl + 'getHomeGoods',
		method: 'GET',
		data
	})
}

export const getGoodsInfoApi = (data: any) => {
	return request({
		url: preGoodsUrl + 'getGoodsInfo',
		method: 'GET',
		data
	})
}

export const getGoodsCommentsApi = (data: any) => {
	return request({
		url: preGoodsUrl + 'getGoodsComments',
		method: 'POST',
		data
	})
}

export const getCommentsCountApi = (data: any) => {
	return request({
		url: preGoodsUrl + 'getCommentsCount',
		method: 'GET',
		data
	})
}