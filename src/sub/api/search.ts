import { request} from '@/utils/request';
const preUrl = 'search/';

export const getSearchHelperApi = data => {
	return request({
		url: preUrl + 'helper',
		method: 'post',
		data
	})
}

export const getSearchHistoryListApi = data => {
	return request({
		url: preUrl + 'getHistory',
		method: 'post',
		data
	})
}

export const getSearchGoodsListApi = data => {
	return request({
		url: preUrl + 'list',
		method: 'post',
		data
	})
}

export const getRecommendAndHotKeywordApi = () => {
	return request({
		url: preUrl + 'getRecommendAndHotKeyword',
		method: 'get'
	})
}

export const emptySearchHistoryApi = () => {
	return request({
		url: preUrl + 'emptySearchHistory',
		method: 'get'
	})
}