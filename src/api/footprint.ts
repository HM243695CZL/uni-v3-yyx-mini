import { request } from '@/utils/request';
const preUrl = 'footprint/';

export const getFootprintListApi = data => {
	return request({
		url: preUrl + 'getFootprintList',
		method: 'get'
	})
}