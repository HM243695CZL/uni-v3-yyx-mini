<template>
	<view class="choose-specifition">
		<uni-popup ref="popupRef" background-color="#fff">
			规格
		</uni-popup>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	
	const props = defineProps({
		info: {
			type: Object
		}
	});
	const popupRef = ref();
	const state = reactive({
		currentSpecifition: ''
	})
	const openPopup = () => {
		popupRef.value.open('bottom');
	};
	defineExpose({
		openPopup
	});
</script>

<style>
</style>