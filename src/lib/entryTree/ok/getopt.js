

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
                return [`${key}/${fqdn}`, parts[0], ...parts.slice(1)];
            } catch (error) {
                console.error(`Error parsing URL: ${parts[0]}`, error);
                return ['suoyiai.com', parts[0], ...parts.slice(1)];
            }
        });
        // fqdnUrlTagsMapArrays[key].push([key, fqdnUrlTagsMapArrays[key][0][1], "", ...fqdnUrlTagsMapArrays[key][0].slice(2)]);
        fqdnUrlTagsMapArrays[key].push([key, "", ""]);
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






export async function fetchDataForParams(fqdnUrlTagsMapArrays) {
    const result = {};
    await Promise.all(Object.entries(fqdnUrlTagsMapArrays).map(async ([key, urlInfoArray]) => {
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





export async function loadComponents(pathUrlTagsMapArrays, regex) {
    const components = {};
    const loadPromises = [];

    for (const [key, value] of Object.entries(pathUrlTagsMapArrays)) {
        for (const item of value) {
            const match = regex.exec(item[0]);
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
