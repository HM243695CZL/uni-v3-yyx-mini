import {request} from '@/utils/request';
const preUrl = 'issue/';

export const getIssueListApi = data => {
	return request({
		url: preUrl + 'list',
		method: 'get',
		data
	})
}