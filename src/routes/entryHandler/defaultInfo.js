// src/routes/config.js

export async function get(request) {
    const configData = {
        // 这里填写你的配置数据
        key1: "value1",
        key2: "value2",
        // 更多配置项...
    };

    return {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(configData)
    };
}
