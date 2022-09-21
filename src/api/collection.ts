import { request } from '@/utils/request';
const preUrl = 'collection/';

export const changeCollectionStatusApi = data => {
	return request({
		url: preUrl + 'status/' + data.goodsId,
		method: 'get'
	})
}

export const getCollectionListApi = () => {
	return request({
		url: preUrl + 'getCollectionList',
		method: 'get'
	})
}

export const emptyCollectionApi = data => {
	return request({
		url: preUrl + 'emptyCollection',
		method: 'post',
		data
	})
}