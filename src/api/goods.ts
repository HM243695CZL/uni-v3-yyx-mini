import {request} from '@/utils/request';
const preUrl = 'home/';

export const getHomeGoodsApi = data => {
	return request({
		url: preUrl + 'getHomeGoods',
		method: 'get',
		data
	})
}