import { request } from '@/utils/request';
const preUrl = 'collection/';

export const changeCollectionStatusApi = data => {
	return request({
		url: preUrl + 'status/' + data.goodsId,
		method: 'get'
	})
}