import store from '@/store';

export const baseUrl = 'http://192.168.0.101:9090/wx/';
export const SUCCESS_CODE = 200;

interface RequestObj {
	url: string;
	method: string;
	data: any;
}
export const request = ({url, method, data}: RequestObj, showLoading: boolean = true) => {
	let token = "Bearer ";
	token += uni.getStorageSync('token');
	let httpDefaultOpts: any = {
		url: baseUrl + url,
		data: data,
		method: method,
		header: method == 'get' ? {
			'Authorization': token,
			"Accept": "application/json, text/plain, */*",
			"Content-Type": "application/json; charset=UTF-8"
		} : {
			'Authorization': token,
			"Accept": "application/json, text/plain, */*",
			'Content-Type': 'application/json; charset=UTF-8'
		},
		dataType: 'json',
	}
	let promise = new Promise(function(resolve, reject) {
		if (showLoading) {
			uni.showLoading({
				title: ''
			});
		}
		uni.request(httpDefaultOpts).then(res => {
			if (showLoading) {
				uni.hideLoading();
			}
			if (res.data.status === SUCCESS_CODE) {
				resolve(res.data)
			} else if(res.data.status === 401) {
				uni.showToast({
					icon: 'error',
					title: res.data.message
				});
				uni.clearStorage();
				store.dispatch('setUserInfo', {})
			} else {
				uni.showToast({
					icon: 'error',
					title: res.data.message
				})
			}
		}).catch(response => {
			if (showLoading) {
				uni.hideLoading();
			}
			if (response.errMsg === 'request:fail ') {
				uni.showToast({
					icon: 'error',
					title: '服务器未启动'
				});
			}
			reject(response)
		})
	})
	return promise
};

export const tokenRequest = ({ url, method, data }: RequestObj) => {
	let token = "Bearer ";
	token += uni.getStorageSync('token');
	//此token是登录成功后后台返回保存在storage中的
	let httpDefaultOpts: any = {
		url: baseUrl + url,
		data: data,
		method: method,
		header: {
			'Authorization': token
		},
		dataType: 'json',
	}
	let promise = new Promise(function(resolve, reject) {
		uni.showLoading({
			title: ''
		});
		uni.request(httpDefaultOpts).then(res => {
			uni.hideLoading();
			if (res.data.status === SUCCESS_CODE) {
				resolve(res.data)
			} else {
				uni.showToast({
					icon: 'error',
					title: res.data.message
				})
			}
		}).catch(response => {
			uni.hideLoading()
			reject(response)
		})
	})
	return promise
}