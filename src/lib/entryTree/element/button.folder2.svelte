<script>
    import { infoBase } from '$lib/entry/STORE.js';

    export let primaryKey;
    export let path;
    export let children;

    // 创建一个本地存储来跟踪选中状态
    let isSelected;
    const pathSelectedProp = `${path}/selected.senseurl.x`;
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



<!-- 

GPT，我的好伙计，我正在使用svelteKit 构建web应用。这是其中一个模块，用与对展示的目录树（类似jstree）的目录做点击/选中功能：

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

</button>

对其中的这里函数：handleClick 我需要做改进，因为是目录，如果选选择，则应该使得目录下所有对象都处于选择状态， -->
