import {request} from '@/utils/request';

export const getSessionIdApi = (data) => {
	return request({
		url: 'cms/user/getSessionId',
		method: 'get',
		data
	})
}
