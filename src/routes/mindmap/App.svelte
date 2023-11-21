<script>
	import Explorer from "./Explorer/Explorer.svelte";
	// // 获取 URL 参数并处理默认值
	// function getURLParameters(searchString, defaultParams) {
	// 	const params = new URLSearchParams(searchString);
	// 	const result = {};
	// 	for (const [key, value] of params.entries()) {
	// 		result[key] = value;
	// 	}
	// 	return Object.keys(result).length === 0 ? defaultParams : result;
	// }

	// const infoUrl = getURLParameters(window.location.search, {
	// 	a00: `${window.location.origin}/0/a00`,
	// });
	// console.log("Final parameters:", infoUrl);


	// 获取 URL 参数并处理默认值
	// 使用 | 与 == 分割参数与赋值, 示例: http://localhost:8080/index.html?a00==http://127.0.0.1:8002/0/a00?v1=x&v2=y|a00_show==http://127.0.0.1:8002/0/a01?v3=1&v4=0
	function parseCustomURLParams(queryString, defaultParams, result = {}) {
		if (!queryString) {return defaultParams;}
		queryString.split('|').forEach(param => {
			const [key, value] = param.split('==');
			if (key && value) {result[key] = value;}
		});

		return Object.keys(result).length === 0 ? defaultParams : result;
	}
	
	const infoUrl = parseCustomURLParams(window.location.search.slice(1), {a00: `${window.location.origin}/0/a00`,});
	console.log("Custom URL parameters with defaults:", infoUrl);




	// 获取文件列表
	let infoBase = [];
	async function fetchDataForParams(infoUrl) {
		const result = {};
		for (const [key, url] of Object.entries(infoUrl)) {
			try {
				const response = await fetch(url);
				if (!response.ok) {throw new Error(`Request failed with status ${response.status}`);}
				const data = await response.json(); // 假设服务器返回的是 JSON 数据:  ["0/a00/.auth","0/a00/探索","0/a00/通讯录",]
				result[key] = data;
			} catch (error) {
				console.error(`Error fetching data for ${key}:`, error);
				result[key] = [];
			}
		}
		return result;
	}

	fetchDataForParams(infoUrl).then((result) => {
		infoBase = result;
		console.log("Fetched data:", infoBase); // 现在这里会在数据被赋值之后执行
	});


	import Router from 'svelte-spa-router';
	import Home from './Tree.svelte';
	import Display from './Display.svelte';

	// 定义路由
	const routes = {
		'/': Home,
		'/display': Display,
	};

</script>



<Router {routes} />
  


<main class="rows-container">
	<!-- <button on:click={handleFolderClick}>Add Column</button> -->
	{#each infoBase as column, columnIndex}
		<div class="column-container">
			{#each column as folder, folderIndex}
				<div class="column-container">
					<Explorer {infoUrl} {infoBase} />
					<!-- <Explorer name="./" files={folder['./']} columnIndex={columnIndex} folderIndex={folderIndex} expanded on:folderclick={handleFolderClick} /> -->
					<!-- <pre>{JSON.stringify(column, null, 2)}</pre> -->
				</div>
			{/each}
		</div>
	{/each}
</main>






<style>
	.rows-container {
		display: flex;
		white-space: nowrap;
		/* flex-direction: column;  竖向排列 */
	}
	.column-container {
		flex-direction: column; /* 竖向排列*/
	}
</style>
