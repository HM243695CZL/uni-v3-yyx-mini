import { request } from '@/utils/request';
const preUrl = 'oss/';

export const policyApi = () => {
	return request({
		url: preUrl + 'policy',
		method: 'get'
	})
}