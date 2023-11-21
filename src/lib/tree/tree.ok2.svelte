<!-- Tree.svelte -->
<script>
    import TreeNode from '$lib/TreeNode.svelte';
    export let entries = [];

    // 找到所有顶级路径(也就是所有子数组的第一个元素 不包含 / 的)
    $: topLevelEntries = entries.filter(entry => !entry[0].includes('/'));
</script>

{#each topLevelEntries as entry}
    <TreeNode path={entry[0]} {entries} />
{/each}

