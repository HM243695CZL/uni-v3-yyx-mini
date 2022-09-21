import { request } from '@/utils/request';
const preUrl = 'region/';

export const getRegionListApi = () => {
	return request({
		url: preUrl + 'list',
		method: 'get'
	})
}