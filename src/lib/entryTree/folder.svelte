<script>
    import Expand from "$lib/entryTree/expand.svelte";
    import { onMount } from 'svelte';
    import { slide } from "svelte/transition";
    import { infoBase } from '$lib/entry/STORE.js';
    import { loadComponents } from '$lib/entry/getopt.js';
    import { toggleProperty } from '$lib/entry/fileSystemUtils';
    
    export let primaryKey;
    export let path;
    export let children;

    
    // 创建一个本地存储来跟踪展开状态
    const pathSelectedProp = `${path}/expanded.senseurl.x`;
    $: isOpen = children.includes(pathSelectedProp);
    async function handleClick() {
        $infoBase[primaryKey] = await toggleProperty($infoBase[primaryKey], pathSelectedProp);
        console.log("$infoBase:", $infoBase);
    }


    // 处理组件
    $: infoset = {[primaryKey]:$infoBase[primaryKey]};
    let components;
    onMount(async () => {
        const moduleRegex = /(?<=\$)lib(\/[^\$]+)+\.(js|svelte)(?=[#\/]folderNameButton\.(\d+)\.senseurl\.x)/;
        components = await loadComponents(infoset, moduleRegex);
        // console.log("component:", component);
    });


</script>



<button on:click={handleClick}>
    {isOpen ? '⏷' : '⏵'}
</button>



{#if components && components[primaryKey]}
    {#each components[primaryKey] as component}
        <svelte:component this={component} {primaryKey} {path} {children}/>
    {/each}
{/if}



{#if isOpen}
    <div transition:slide={{ duration: 300 }}>
        <!-- 这里的 (child) 是每个列表项的键。当 children 数组的内容发生变化时，Svelte 会基于这些键来决定哪些项需要重新渲染。 -->
        {#each children as child (child)}
            <Expand {primaryKey} path={child}/>
        {/each}
    </div>
{/if}




<style>
	button {
		/* padding: 0 0 0 1.5em; */
		/* background-size: 1em 1em; */
		/* font-weight: bold; */
		/* cursor: pointer; */
		border:none;
		/* font-size:14px; */
	}
/* ↻↻ ❯*/

</style>