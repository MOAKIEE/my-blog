<script>
import { onMount } from "svelte";
import { pioConfig } from "@/config";

const defaultCdn = "https://cdn.jsdelivr.net/gh/letere-gzj/live2d-widget-v3@main";

function loadExternalResource(url, type) {
	return new Promise((resolve, reject) => {
		if (!url) {
			reject(new Error("Resource url is empty"));
			return;
		}

		const selector = type === "css"
			? `link[data-live2d-src='${url}']`
			: `script[data-live2d-src='${url}']`;
		if (document.querySelector(selector)) {
			resolve(url);
			return;
		}

		let tag;
		if (type === "css") {
			tag = document.createElement("link");
			tag.rel = "stylesheet";
			tag.href = url;
		} else {
			tag = document.createElement("script");
			tag.src = url;
		}

		tag.setAttribute("data-live2d-src", url);
		tag.onload = () => resolve(url);
		tag.onerror = () => reject(new Error(`Failed to load: ${url}`));
		document.head.appendChild(tag);
	});
}

function initLive2dWidget() {
	if (typeof window === "undefined") {
		return;
	}

	if (!pioConfig.enable) {
		return;
	}

	if (screen.width < 768) {
		return;
	}

	const cdnBase = (pioConfig.v3?.cdnBasePath || defaultCdn).replace(/\/$/, "");
	const modelPath = pioConfig.v3?.modelPath || "/pio-v3/Resources/";
	const homePath = pioConfig.v3?.homePath || "/";
	const tools = pioConfig.v3?.tools || ["hitokoto", "asteroids", "express", "switch-model", "switch-texture", "photo", "info", "quit"];
	const dragDirection = pioConfig.v3?.drag?.direction || ["x", "y"];

	const widgetConfig = {
		path: {
			homePath,
			modelPath,
			cssPath: `${cdnBase}/waifu.css`,
			tipsJsonPath: pioConfig.v3?.tipsJsonPath || `${cdnBase}/waifu-tips.json`,
			tipsJsPath: `${cdnBase}/waifu-tips.js`,
			live2dCorePath: `${cdnBase}/Core/live2dcubismcore.js`,
			live2dSdkPath: `${cdnBase}/live2d-sdk.js`,
		},
		tools,
		drag: {
			enable: pioConfig.v3?.drag?.enable ?? true,
			direction: dragDirection,
		},
		switchType: pioConfig.v3?.switchType || "order",
	};

	const ensureWaifuPosition = () => {
		const waifu = document.getElementById("waifu");
		if (!waifu) {
			return;
		}
		waifu.style.position = "fixed";
		waifu.style.left = "0px";
		waifu.style.top = "auto";
		waifu.style.right = "auto";
		waifu.style.bottom = "0px";
	};

	const ensureWaifuStyles = () =>
		Promise.all([
			loadExternalResource(widgetConfig.path.cssPath, "css"),
			loadExternalResource("/pio-v3/live2d-overrides.css", "css"),
		]);

	const reapplyOnSwupView = () => {
		ensureWaifuStyles()
			.then(() => {
				ensureWaifuPosition();
			})
			.catch((error) => {
				console.error("Live2D style recovery failed:", error);
			});
	};

	document.addEventListener("swup:page:view", reapplyOnSwupView);

	if (document.getElementById("waifu") || document.getElementById("waifu-toggle")) {
		reapplyOnSwupView();
		return;
	}

	localStorage.setItem("modelId", "0");
	localStorage.setItem("modelTexturesId", "0");

	Promise.all([
		ensureWaifuStyles(),
		loadExternalResource(widgetConfig.path.live2dCorePath, "js"),
		loadExternalResource(widgetConfig.path.live2dSdkPath, "js"),
		loadExternalResource(widgetConfig.path.tipsJsPath, "js"),
	])
		.then(() => {
			if (typeof window.initWidget !== "function") {
				throw new Error("initWidget is not available");
			}

			window.initWidget({
				homePath: widgetConfig.path.homePath,
				waifuPath: widgetConfig.path.tipsJsonPath,
				cdnPath: widgetConfig.path.modelPath,
				tools: widgetConfig.tools,
				dragEnable: widgetConfig.drag.enable,
				dragDirection: widgetConfig.drag.direction,
				switchType: widgetConfig.switchType,
			});
			ensureWaifuPosition();

			// 覆盖 info 按钮链接为拉菲II wiki 页面
			const infoBtn = document.getElementById("waifu-tool-info");
			if (infoBtn) {
				infoBtn.addEventListener("click", (e) => {
					e.stopPropagation();
					e.preventDefault();
					window.open("https://wiki.biligame.com/blhx/%E6%8B%89%E8%8F%B2II");
				}, true);
			}
		})
		.catch((error) => {
			console.error("Live2D widget-v3 init failed:", error);
		});
}

onMount(() => {
	initLive2dWidget();
});
</script>