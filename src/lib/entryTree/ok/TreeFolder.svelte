<script>
    import TreeNode from "$lib/entryHandler/TreeNode.svelte";
    import { slide } from "svelte/transition";

    export let path;
    export let children;
    export let entries;
    let isOpen = false;

    function toggle() {
        isOpen = !isOpen;
    }
</script>

<button on:click={toggle}>
    {path.split("/").pop()}
</button>

<ul>
    {#if isOpen}
        <div transition:slide={{ duration: 233 }}>
            {#each children as child}
                <li>
                    <TreeNode path={child[0]} {entries} />
                </li>
            {/each}
        </div>
    {/if}
</ul>

<style>
        ul {

padding: 0.2em 0 0 0.5em;
margin: 0 0 0 0.5em;
list-style: none;
border-left: 1px solid #eee;

}


    li {
        padding: 0.2em 0;
    }
</style>
