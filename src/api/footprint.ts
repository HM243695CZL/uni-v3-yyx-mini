import { request } from '@/utils/request';
const preUrl = 'footprint/';

export const getFootprintListApi = () => {
	return request({
		url: preUrl + 'getFootprintList',
		method: 'get'
	})
}

export const emptyFootprintApi = data => {
	return request({
		url: preUrl + 'emptyFootprint',
		method: 'post',
		data
	})
}