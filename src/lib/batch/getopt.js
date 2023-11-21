export function parseCustomURLParams(queryString, defaultParams, result = {}) {
	if (!queryString) {return defaultParams;}
	queryString.split('|').forEach(param => {
		const [key, value] = param.split('==');
		if (key && value) {result[key] = value;}
	});
	return Object.keys(result).length === 0 ? defaultParams : result;
}

export async function fetchDataForParams(infoUrl) {
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

export async function initializePageData(defaultUrl, defaultInfo, inputUrl, mergeKey, setInfoUrl, setInfoBase) {
    const parsedInfoUrl = parseCustomURLParams(inputUrl, defaultUrl);
    console.log("Custom URL parameters with defaults:", parsedInfoUrl);
    let updatedInfoBase = { ...defaultInfo };
    if (mergeKey && parsedInfoUrl[mergeKey]) {
        try {updatedInfoBase = { ...updatedInfoBase, ...JSON.parse(decodeURIComponent(parsedInfoUrl[mergeKey]))};
        } catch (error) {console.error(`Error parsing merge data for ${mergeKey}:`, error);}
        delete parsedInfoUrl[mergeKey]; // 从fetch的列表中去除
    }
    return fetchDataForParams(parsedInfoUrl).then((result) => {
        updatedInfoBase = { ...result, ...updatedInfoBase };
        setInfoUrl(parsedInfoUrl);
        setInfoBase(updatedInfoBase);
        console.log("Fetched data with parsedInfoUrl:", parsedInfoUrl);
        console.log("Fetched data with merged params:", updatedInfoBase);
    });
}




{/* <script>
	import { onMount } from 'svelte';
	import { initializePageData } from '$lib/getopt';
	let infoUrl = {};
	let infoBase = [];

	// 获取 URL 参数并处理默认值
	// 使用 | 与 == 分割参数与赋值, 示例: http://localhost:5173/?a00==http://127.0.0.1:8002/0/a00?v1=x&v2=y|a00_show==http://127.0.0.1:8002/0/a01?v3=1&v4=0|infoBase=={"k1":["v1","v2"],"k2":["v2"]}
	onMount(() => {
        infoUrl = window.location.search.slice(1);
		//第一个参数是infoUrl为空时的默认值, 第三个参数infoBase的初始值,可以被覆盖
        initializePageData({"a00":`${window.location.origin}/0/a00`}, infoUrl, {}, "infoBase", (result)=>{infoUrl=result;}, (result)=>{infoBase=result;})
    });
</script> */}