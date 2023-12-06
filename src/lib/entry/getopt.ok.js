
export function parseCustomURLParameters(urlParamsString, defaultOptions, parsedResults = {}) {
    if (!urlParamsString) { return defaultOptions; }

    urlParamsString.split(';;').forEach(urlParam => {
        const [key, value] = urlParam.split('==');

        if (!key || !value) {
            if (urlParam.trim() !== '') { console.error(`Format error in URL 格式错误: '${urlParam}'. Expected format: 'key==value'.`); }
            return;
        }

        if (value.startsWith('{') && value.endsWith('}')) {
            parsedResults[key] = value;
        } else {
            parsedResults[key] = value.split(';').map(item => {
                const parts = item.split('|');
                try {
                    const url = new URL(parts[0]);
                    const fqdn = url.hostname; // 提取主机名
                    return [fqdn, parts[0], ...parts.slice(1)]; // 将除了第一个元素以外的所有元素添加到数组
                } catch (error) {
                    console.error(`Error parsing URL: ${parts[0]}`, error);
                    return ['suoyiai.com', parts[0], ...parts.slice(1)]; // 同样处理，即使 URL 无效
                }
            });
            
        }
    });

    console.log("Parsed URL Parameters:", parsedResults);
    return parsedResults;
}







export async function fetchDataForParams(params) {
    const result = {};
    await Promise.all(Object.entries(params).map(async ([key, urlInfoArray]) => {
        result[key] = [];

        for (const [, url, ...extraInfo] of urlInfoArray) {
            try {
                const response = await fetch(url);
                if (!response.ok) { throw new Error(`Request failed with status ${response.status}`); }

                const data = await response.json();
                const modifiedData = data.map(item => [item, url, ...extraInfo]);
                result[key] = result[key].concat(modifiedData);
            } catch (error) { console.log(`Error fetching data for ${key} at ${url}`, error); }
        }
    }));
    return result;
}







export async function initializePageData(defaultOptions, defaultInfo, inputOptions, mergeKey, setOptions, setInfoBase) {
    const parsedOptions = parseCustomURLParameters(inputOptions, defaultOptions);

    let updatedInfo = { ...defaultInfo };
    if (mergeKey && parsedOptions[mergeKey]) {
        try {
            const mergedData = JSON.parse(decodeURIComponent(parsedOptions[mergeKey]));
            updatedInfo = { ...mergedData, ...updatedInfo };
        } catch (error) { console.log(`Error parsing merge data for ${mergeKey}`, error); }
        delete parsedOptions[mergeKey];
    }

    try {
        const result = await fetchDataForParams(parsedOptions);
        updatedInfo = { ...result, ...updatedInfo };
        setOptions(parsedOptions);
        setInfoBase(updatedInfo);

        console.log("Fetched data with parsedOptions:", parsedOptions);
        console.log("Fetched data with merged params:", updatedInfo);

    } catch (error) { console.log(`Error fetching data`, error); }
}




{/* 

<script>
	import { onMount } from 'svelte';
	import { initializePageData } from '$lib/getopts';
	let options = {};
	let infoBase = [];

	// 获取 URL 参数并处理默认值
	// 使用 | 与 == 分割参数与赋值, 示例: http://localhost:5173/?a00==http://127.0.0.1:8002/0/a00?v1=x&v2=y|type_1;http://127.0.0.1:8002/0/a01|type_x;;a02==http://127.0.0.1:8002/0/a01;;infoBase=={"k1":["v1","v2"],"k2":["v2"]}
	onMount(() => {
        options = window.location.search.slice(1);
		//第一个参数是options为空时的默认值, 第三个参数infoBase的初始值,可以被覆盖
        initializePageData({"a00": [[`${window.location.origin}/0/a00`,""]]}, options, [], "infoBase", (result)=>{options=result;}, (result)=>{infoBase=result;})
    });
</script>

*/}