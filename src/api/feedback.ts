import { request } from '@/utils/request';
const preUrl = 'feedback/';

export const saveFeedbackApi = data => {
	return request({
		url: preUrl + 'create',
		method: 'post',
		data
	})
}