import {request} from '@/utils/request';
const preUrl = 'home/';
const preGoodsUrl = 'goods/'

export const getHomeGoodsApi = data => {
	return request({
		url: preUrl + 'getHomeGoods',
		method: 'get',
		data
	})
}

export const getGoodsInfoApi = data => {
	return request({
		url: preGoodsUrl + 'getGoodsInfo',
		method: 'get',
		data
	})
}