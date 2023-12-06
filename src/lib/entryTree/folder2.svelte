<script>
    import Expand from "$lib/entryTree/expand.svelte";
    import { slide } from "svelte/transition";

    export let primaryKey;
    export let path;
    export let children;

    let isOpen = false;
    function toggle() { isOpen = !isOpen; }
</script>

<button on:click={toggle}>
    {path.split("/").pop()}
</button>

<ul>
    {#if isOpen}
        <div transition:slide={{ duration: 300 }}>
            <!-- <li> -->

            {#each children as child}
                    <Expand {primaryKey} path={child[0]}/>
            {/each}
        <!-- </li> -->
    </div>
    {/if}
</ul>

<style>
    ul {
        padding: 0.2em 0 0 0.5em;
        margin: 0 0 0 0.5em;
        /* list-style: none; */
        border-left: 1px solid #eee;

    }


    /* li {
        padding: 0.2em 0;
    } */
</style>
