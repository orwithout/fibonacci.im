// dataService.js
import { parseURLParameters, parseJSONParameters, fetchDataForParams, mergeWithAppend } from '$lib/entry/getopt.js';
import { upgradeDB } from '$lib/indexedDB/common.js';

export async function loadData(inputSearch) {
    // 前端页面代码内置默认数据
    const defaultUrl = await parseURLParameters(`senseurl==${window.location.origin}/entryDefault.json`);
    const defaultInfo = await fetchDataForParams(defaultUrl);

    // 本地 indexedDB 存储的数据
    const localUrl = await parseURLParameters(`localDir==${window.location.origin}/indexedDB?storename=infoBase`);
    const localInfo = await fetchDataForParams(localUrl);

    // 从参数中解析出的数据
    const inputJson = await parseJSONParameters(inputSearch);
    const inputUrl = { ...(await parseURLParameters(inputSearch)), ...inputJson.Url || {} };
    const inputInfo = { ...(await fetchDataForParams(inputUrl)), ...inputJson.Info || {} };

    // 合并规则
    const mergedInfo = inputSearch === '' 
        ? { ...defaultInfo, ...(localInfo || {}) }
        : mergeWithAppend({ ...defaultInfo, ...(localInfo || {}) }, (inputInfo || {}));
    
    const mergedUrl = inputSearch === ''
        ? { ...defaultUrl, ...(localUrl || {}) }
        : mergeWithAppend({ ...defaultUrl, ...(localUrl || {}) }, (inputUrl || {}));

	console.log("inputSearch:", inputSearch);
	console.log("defaultInfo:", defaultInfo);
	console.log("localInfo:", localInfo);
	console.log("inputInfo:", inputInfo);
	console.log("mergedInfo:", mergedInfo);
	console.log("mergedUrl:", mergedUrl);
    return { mergedInfo, mergedUrl };
}

export async function upgradeDatabase() {
    // 初始化 indexedDB 回收站
    await upgradeDB("RecycleBin", "create");
}

