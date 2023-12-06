<script>
    import { infoBase } from '$lib/entry/STORE.js';

    export let primaryKey;
    export let path;
    export let children;

    // 创建一个本地存储来跟踪选中状态
    let isSelected;
    const pathSelectedProp = `${path}/selected.i`;
    // 检查初始状态
    $: isSelected = children.includes(pathSelectedProp);
    // $: children = children || [];

    // 点击事件处理
    async function handleClick() {
        
        if (isSelected) {
            // 移除选中项
            $infoBase[primaryKey] = $infoBase[primaryKey].filter(item => item[0] !== pathSelectedProp);
        } else {
            // 添加选中项
            $infoBase[primaryKey] = [...$infoBase[primaryKey] || [], [pathSelectedProp]];
        }
        console.log("$infoBase:", $infoBase);
    }
</script>

<button on:click={handleClick} class:selected={isSelected}>
    { path.split('/').pop()}
    <!-- {console.log("children:", children)}
    {console.log("pathx:", path)} -->
</button>

<style>
    button {
        background: none;
        font-weight: bold;
        border: none;
    }

    button.selected {
        background-color: rgb(197, 231, 243); /* 选中状态的背景色 */
    }
</style>
