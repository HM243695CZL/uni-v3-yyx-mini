import {request} from '@/utils/request';
const preUrl = 'address/';

export const saveAddressApi = data => {
	return request({
		url: preUrl + 'create',
		method: 'post',
		data
	})
}

export const getAddressListApi = () => {
	return request({
		url: preUrl + 'getAddressList',
		method: 'get'
	})
}