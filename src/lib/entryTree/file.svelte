<script>
    import { onMount } from 'svelte';
    import { infoBase } from '$lib/entry/STORE.js';
    import { loadComponents } from '$lib/entry/getopt.js';

    export let primaryKey;
    export let path;
    export let children;

    // $: children = children || [];

    const getFileExtension = (path) => {
        const parts = path.split('.');
        // 如果路径不包含点号或最后一个部分为空（即路径以点号结束），则返回空字符串或"default"
        return parts.length > 1 && parts[parts.length - 1] ? parts[parts.length - 1] : "default";
    };

    function handleIconError(event) {
        const defaultIconSrc = '/icons/file-type-default.svg';
        // 检查是否已经尝试过加载默认图标
        if (event.target.alt !== 'default') {
            event.target.src = defaultIconSrc;
            event.target.alt = 'default'; // 设置标记
        }
    }


    $: infoset = {[primaryKey]:$infoBase[primaryKey]};
    let components;
    onMount(async () => {
        const moduleRegex = /(?<=\$)lib(\/[^\$]+)+\.(js|svelte)(?=[#\/]fileNameButton\.(\d+)\.senseurl\.x)/;
        components = await loadComponents(infoset, moduleRegex);
        // console.log("component:", component);
    });
    

    let isClicked = false;
    function toggleBackground() { isClicked = !isClicked; }

    // const displayName = path.split('/').pop();
</script>


<button on:click={toggleBackground} class:clicked={isClicked}>
    <img class="icon"
        src={`/icons/file-type-${getFileExtension(path)}.svg`}
        alt="File Icon"
        on:error={handleIconError} />
</button>



{#if components && components[primaryKey]}
    {#each components[primaryKey] as component}
        <svelte:component this={component} {primaryKey} {path} {children}/>
    {/each}
{/if}


<style>
    .icon {
        margin-left: 0.435em;
        width: 1em;
        height: 1em;
    }

    button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    button.clicked .icon {
        background-color: lightblue; /* 被点击时的背景色 */
    }
</style>