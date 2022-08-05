import {request} from '@/utils/request';
const preUrl = 'address/';

export const saveAddressApi = (data: any) => {
	return request({
		url: preUrl + 'create',
		method: 'POST',
		data
	})
}

export const getAddressListApi = () => {
	return request({
		url: preUrl + 'getAddressList',
		method: 'GET',
		data: ''
	})
}

export const emptyAddressApi = (data: any) => {
	return request({
		url: preUrl + 'emptyAddress',
		method: 'POST',
		data
	})
}

export const getAddressInfoApi = (params: any) => {
	return request({
		url: preUrl + 'getAddressInfo/' + params.id,
		method: 'GET'
	})
}

export const setDefaultAddressApi = (data: any) => {
	return request({
		url: preUrl + 'setDefaultAddress',
		method: 'POST',
		data
	})
}