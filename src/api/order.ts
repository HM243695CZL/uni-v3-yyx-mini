import {request} from '@/utils/request';
const preUrl = 'order/';

export const submitOrderInfoApi = (data: any) => {
	return request({
		url: preUrl + 'submitOrder',
		method: 'POST',
		data
	})
}