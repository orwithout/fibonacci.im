import { infoBase } from '$lib/entry/STORE.js';

export async function handleSelectionToggle({ primaryKey, path, children }) {
    let isSelected = children.includes(`${path}/selected.i`);
    let updatedInfoBase = { ...$infoBase };

    if (isSelected) {
        // 移除选中项
        updatedInfoBase[primaryKey] = updatedInfoBase[primaryKey].filter(item => item !== `${path}/selected.i`);
    } else {
        // 添加选中项
        updatedInfoBase[primaryKey] = [...updatedInfoBase[primaryKey] || [], `${path}/selected.i`];
    }

    // 更新 infoBase
    infoBase.set(updatedInfoBase);

    // 返回更新后的 isSelected 状态
    return !isSelected;
}
