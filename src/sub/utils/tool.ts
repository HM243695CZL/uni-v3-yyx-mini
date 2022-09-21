/**
 * 工具
 */
export const timestampToDate = (time: number) => {
	return {
		hour: parseInt(time / 1000 / 60 / 60 % 24),
		minute: parseInt(time / 1000 / 60 % 60),
		second: parseInt(time / 1000 % 60)
	};
}