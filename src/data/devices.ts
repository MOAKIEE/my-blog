// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	icon?: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = {
	[categoryName: string]: Device[];
} & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	手机: [
		{
			name: "XIAOMI 13",
			image: "",
			icon: "material-symbols:smartphone",
			specs: "远山蓝 / 12GB + 256GB",
			description: "小米旗舰手机，徕卡影像，骁龙8 Gen2处理器。",
			link: "https://www.mi.com/xiaomi-13",
		},
	],
	平板: [
		{
			name: "拯救者 Y700",
			image: "",
			icon: "material-symbols:tablet-android",
			specs: "黑色 / 12GB + 256GB",
			description: "联想游戏平板，骁龙870处理器，适合游戏和娱乐。",
			link: "https://www.lenovo.com.cn/y700",
		},
	],
};
