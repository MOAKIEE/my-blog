// Project data configuration file

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "minecraft-mod" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	visitUrl?: string;
}

export const projectsData: Project[] = [
	{
		id: "me-placement-tool",
		title: "ME Placement Tool",
		description:
			"A Minecraft mod that adds placement tools for Applied Energistics 2. Place blocks, AE2 cable parts, and fluids directly from your ME network.",
		image: "",
		category: "minecraft-mod",
		techStack: ["Java", "Minecraft", "Forge", "AE2"],
		status: "completed",
		liveDemo: "https://mept.moakiee.xyz/",
		sourceCode: "https://github.com/MOAKIEE/ME-Placement-Tool",
		visitUrl: "https://mept.moakiee.xyz/",
		startDate: "2025-12-17",
		featured: true,
		tags: ["Minecraft", "Mod", "AE2"],
	},
	{
		id: "haji-timetable",
		title: "哈基课程表",
		description:
			"一款简洁美观的 Android 课程表应用，支持多课表管理、智能冲突检测、日历同步、二维码分享等功能。",
		image: "",
		category: "mobile",
		techStack: ["Kotlin", "Jetpack Compose", "Android", "Room"],
		status: "completed",
		sourceCode: "https://github.com/MOAKIEE/haji-timetable",
		visitUrl: "https://github.com/MOAKIEE/haji-timetable",
		startDate: "2025-12-04",
		featured: true,
		tags: ["Android", "App", "Kotlin"],
	},
	{
		id: "me-placement-tool-site",
		title: "ME Placement Tool Site",
		description:
			"ME Placement Tool 官方网站，展示模组功能、下载链接和使用文档。",
		image: "",
		category: "web",
		techStack: ["TypeScript", "Vite", "Tailwind CSS"],
		status: "completed",
		liveDemo: "https://mept.moakiee.xyz/",
		sourceCode: "https://github.com/MOAKIEE/me-placement-tool-site",
		visitUrl: "https://mept.moakiee.xyz/",
		startDate: "2026-02-11",
		tags: ["Web", "Documentation"],
	},
	{
		id: "sfm-code-generator",
		title: "SFM Code Generator",
		description:
			"Minecraft 模组 Super Factory Manager 的可视化代码生成工具，支持可视化编辑、触发器配置、实时预览。",
		image: "",
		category: "desktop",
		techStack: ["C#", "WPF", ".NET"],
		status: "completed",
		sourceCode: "https://github.com/MOAKIEE/SFMCodeGenerator",
		visitUrl: "https://github.com/MOAKIEE/SFMCodeGenerator",
		startDate: "2026-02-03",
		tags: ["Desktop", "Minecraft", "Tool"],
	},
	{
		id: "sfm-code-generator-web",
		title: "SFM Code Generator Web",
		description:
			"SFM Code Generator 的网页版本，无需安装即可使用。",
		image: "",
		category: "web",
		techStack: ["TypeScript", "Web"],
		status: "completed",
		liveDemo: "https://sfm.moakiee.xyz/",
		sourceCode: "https://github.com/MOAKIEE/SFMCodeGenerator-web",
		visitUrl: "https://sfm.moakiee.xyz/",
		startDate: "2026-02-12",
		tags: ["Web", "Minecraft", "Tool"],
	},
	{
		id: "ae2-infinity-disk",
		title: "AE2 Infinity Disk",
		description:
			"An AE2 addon that provides support for disks with unlimited capacity and types.",
		image: "",
		category: "minecraft-mod",
		techStack: ["Java", "Minecraft", "AE2"],
		status: "completed",
		sourceCode: "https://github.com/cystrySU/AE2-Infinity-Disk",
		visitUrl: "https://github.com/cystrySU/AE2-Infinity-Disk",
		startDate: "2025-12-04",
		tags: ["Minecraft", "Mod", "AE2"],
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter(
		(p) => p.status === "completed",
	).length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
