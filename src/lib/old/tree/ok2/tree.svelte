<script>
    import TreeNode from '$lib/tree/TreeNode.svelte';

    export let option = [];
    export let infoset = [];



    // 预处理 infoset
    let topLevelInfoset = {};

    $: topLevelInfoset = Object.fromEntries(
        Object.entries(infoset).map(([key, value]) => [key, value.filter(entry => !entry[0].includes('/'))])
    );
</script>

<!-- 处理并渲染 option -->
<!-- {#each Object.entries(option) as [key, value]}
    <Explorer name="Home" files={root} expanded />
	
{/each} -->

<!-- 处理并渲染 infoset -->
{#each Object.entries(topLevelInfoset) as [key, value]}
    {#each value as entry}
        <TreeNode path={entry[0]} entries={infoset[key]} />
    {/each}
{/each}







