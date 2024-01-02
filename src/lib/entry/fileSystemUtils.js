export const isFolder = (path, entries) => {
    const senseUrlSuffix = '/isfolder.senseurl.x';
    // 首先尝试使用 isFolderBySenseUrl 函数进行判断
    if (entries.some(entryArray => entryArray[0] === path + senseUrlSuffix)) {
        return true;
    }
    // 如果上面的判断未找到，使用原来的逻辑
    return entries.some(entryArray => entryArray[0].startsWith(path + '/'));
};




// export const isFolderBySenseUrl = (path, entries) => {
//     const senseUrlSuffix = '/isfolder.senseurl.x';
//     return entries.some(entryArray => entryArray[0] === path + senseUrlSuffix);
// };



// export const sortEntries = (a, b, isFolderFunc, entries) => {
//     const isFolderA = isFolderFunc(a, entries);
//     const isFolderB = isFolderFunc(b, entries);
//     if (isFolderA && !isFolderB) { return -1; }
//     if (!isFolderA && isFolderB) { return 1; }
//     return a.localeCompare(b);
// };


// 解析并获取排序数字
const getSortNumber = (path, entries) => {
    const regex = new RegExp(`${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(#|\/)sort\\.(\\d+)\\.senseurl\\.x`);
    for (const entry of entries) {
        const match = entry[0].match(regex);
        if (match) {
            return parseInt(match[2], 10); // 返回找到的数字部分
        }
    }
    return null; // 如果没有找到匹配项
};




export const sortEntries = (a, b, entries) => {
    // 获取排序数字
    const sortNumA = getSortNumber(a, entries);
    const sortNumB = getSortNumber(b, entries);

    // 如果两者都有排序数字
    if (sortNumA !== null && sortNumB !== null) {
        return sortNumA - sortNumB;
    }

    // 如果其中一个有排序数字
    if (sortNumA !== null) return -1;
    if (sortNumB !== null) return 1;


    // 文件夹优先排序
    const isFolderA = isFolder(a, entries);
    const isFolderB = isFolder(b, entries);    
    if (isFolderA && !isFolderB) return -1;
    if (!isFolderA && isFolderB) return 1;

    // 如果都没有排序数字，按字母顺序排序
    return a.localeCompare(b);
};





export const GetChildEntries = (entries, basePath) => {
    let childEntries = new Set();

    entries.forEach(entryArray => {
        const entry = entryArray[0]; // 假设每个元素是一个数组，其第一个元素是路径
        const isDirectChild = entry.startsWith(basePath) && !entry.slice(basePath.length).includes('/');
        if (isDirectChild) {
            childEntries.add(entry);
        }
    });

    return Array.from(childEntries);
};






export async function toggleProperty(infoSet, property) {
    const isPropertyPresent = infoSet.some(item => item[0] === property);

    if (isPropertyPresent) {
        // 移除属性
        return infoSet.filter(item => item[0] !== property);
    } else {
        // 添加属性
        return [...infoSet, [property]];
    }
}