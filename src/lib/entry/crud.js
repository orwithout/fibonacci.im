export async function propertyToggle(infoBase, primaryKey, iPath, children) {
    // let updatedInfoBase = { ...infoBase };

    if (children.includes(iPath)) {
        // 移除选中项
        infoBase[primaryKey] = infoBase[primaryKey].filter(item => item !== iPath);
    } else {
        // 添加选中项
        infoBase[primaryKey] = [...infoBase[primaryKey] || [], iPath];
    }

    // return infoBase;
    // return { updatedInfoBase, isSelected: !isSelected };
}
