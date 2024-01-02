<script>
    import { infoBase } from '$lib/entry/STORE.js';
    import { toggleProperty } from '$lib/entry/fileSystemUtils';


    export let primaryKey;
    export let path;
    export let children;

    // 创建一个本地存储来跟踪选中状态
    const pathSelectedProp = `${path}/selected.senseurl.x`;
    $: isSelected = children.includes(pathSelectedProp);
    async function handleClick() {
        $infoBase[primaryKey] = await toggleProperty($infoBase[primaryKey], pathSelectedProp);
        console.log("$infoBase:", $infoBase);
    }

</script>

<button on:click={handleClick} class:selected={isSelected}>
    {path.split('/').pop()}
</button>



<style>
    button {
        padding: 0 0 0 0;
        background: none;
        /* font-weight: bold; */
        border: none;
    }

    button.selected {
        background-color: rgb(197, 231, 243); /* 选中状态的背景色 */
    }
</style>
