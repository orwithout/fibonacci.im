<script>
    import Expand from "$lib/entryTree/expand.svelte";
    import { onMount } from 'svelte';
    import { slide } from "svelte/transition";
    import { infoBase } from '$lib/entry/STORE.js';
    import { loadComponents } from '$lib/entry/getopt.js';

    export let primaryKey;
    export let path;
    export let children;

    let isOpen = false;
    function toggle() { isOpen = !isOpen; }

    $: infoset = {[primaryKey]:$infoBase[primaryKey]};
    let component;

    onMount(async () => {
        const moduleRegex = /(?<=\$)lib(\/.+)+\.(js|svelte)(?=#folder.button.i)/;
        // console.log("componentx:", component);
        component = await loadComponents(infoset, moduleRegex);
        // console.log("component:", component);
    });
</script>

<button on:click={toggle}>
    {isOpen ? '⏷' : '⏵'}
</button>

{#if component}
    <svelte:component this={component[primaryKey]} {primaryKey} {path} {children}/>
{/if}


<!-- <Button1 text={path.split("/").pop()} /> -->



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