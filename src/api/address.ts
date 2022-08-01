import {request} from '@/utils/request';
const preUrl = 'address/';

export const saveAddressApi = (data: any) => {
	return request({
		url: preUrl + 'create',
		method: 'post',
		data
	})
}

export const getAddressListApi = () => {
	return request({
		url: preUrl + 'getAddressList',
		method: 'get',
		data: ''
	})
}

export const emptyAddressApi = (data: any) => {
	return request({
		url: preUrl + 'emptyAddress',
		method: 'post',
		data
	})
}