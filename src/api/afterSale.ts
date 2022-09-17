import { request } from '@/utils/request';
const preUrl = 'afterSale/';

export const getAfterSaleListApi = (data: any) => {
	return request({
		url: preUrl + 'getAfterSaleList',
		method: 'POST',
		data
	})
}

export const getAfterSaleInfoApi = (data: any) => {
	return request({
		url: preUrl + 'getAfterSaleInfo/' + data.id,
		method: 'GET',
		data
	})
}