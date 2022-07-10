import {request} from '@/utils/request';
const preUrl = 'category/';

export const getSecondCategoryApi = data => {
	return request({
		url: preUrl + 'getSecondCategory',
		method: 'get',
		data
	})
}

export const getGoodsByCategoryIdApi = data => {
	return request({
		url: preUrl + 'getGoodsByCategoryId',
		method: 'post',
		data
	})
}