

export function parseURLParameters(paramsString) {
    let fqdnUrlTagsMapArrays = {};
    paramsString.split(';;').forEach(param => {
        const [key, value] = param.split('==');

        if (!key || !value || !(value.includes('http') || value.includes('https'))) {
            return;
        }

        fqdnUrlTagsMapArrays[key] = value.split(';').map(item => {
            const parts = item.split('|');
            try {
                const url = new URL(parts[0]);
                const fqdn = url.hostname;
                return [`${key}/${fqdn}.http`, parts[0], ...parts.slice(1)];
            } catch (error) {
                console.error(`Error parsing URL: ${parts[0]}`, error);
                return ['suoyiai.com', parts[0], ...parts.slice(1)];
            }
        });
        // fqdnUrlTagsMapArrays[key].push([key, fqdnUrlTagsMapArrays[key][0][1], "", ...fqdnUrlTagsMapArrays[key][0].slice(2)]);
        fqdnUrlTagsMapArrays[key].push([key,]);
    });
    return fqdnUrlTagsMapArrays;
}




export function parseJSONParameters(paramsString) {
    let jsonMapArrays = {};
    paramsString.split(';;').forEach(param => {
        const [key, value] = param.split('==');

        if (!key || !value || !(value.startsWith('{') && value.endsWith('}'))) {
            return;
        }

        try {
            jsonMapArrays[key] = JSON.parse(decodeURIComponent(value));
        } catch (error) {
            console.error(`Error parsing JSON: ${value}`, error);
        }
    });
    return jsonMapArrays;
}





function isValidUrl(urlString) {
    try {
        new URL(urlString);
        return true;
    } catch (e) {
        return false;
    }
}

export async function fetchDataForParams(fqdnUrlTagsMapArrays) {
    const result = {};
    await Promise.all(Object.entries(fqdnUrlTagsMapArrays).map(async ([key, urlInfoArray]) => {
        result[key] = [];

        for (const [, url, ...extraInfo] of urlInfoArray) {
            if (!isValidUrl(url)) {
                // console.log(`Invalid URL: ${url}`);
                continue; // 跳过无效的 URL
            }

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




export function mergeWithAppend(existingData, newData) {
    const mergedData = { ...existingData };

    for (const key in newData) {
        if (newData.hasOwnProperty(key)) {
            if (mergedData.hasOwnProperty(key) && Array.isArray(mergedData[key]) && Array.isArray(newData[key])) {
                // 如果存在相同的键，并且两者都是数组，则合并数组
                mergedData[key] = [...mergedData[key], ...newData[key]];
            } else {
                // 否则，直接赋值
                mergedData[key] = newData[key];
            }
        }
    }

    return mergedData;
}



export async function loadComponents(pathUrlTagsMapArrays, regex) {
    const components = {};
    const loadPromises = [];

    for (const [key, value] of Object.entries(pathUrlTagsMapArrays)) {
        for (const item of value) {
            const match = regex.exec(item[0]);
            // console.log("match:", match);
        if (match) {
                const path = `/src/${match[0]}`;
                loadPromises.push(
                    import(/* @vite-ignore */ path)
                        .then(module => { components[key] = module.default;})
                        .catch(error => { console.error(`加载组件失败：${path}`, error); })
                );
                break;
            }
        }
    
    }
    await Promise.all(loadPromises);
    return components;
}
