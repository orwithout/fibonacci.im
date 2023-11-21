<!-- TreeNode.svelte -->
<script>
    export let path;
    export let children = [];

    let isOpen = false; // 控制节点的展开和折叠
    const parts = path.split('/');

    // 递归地创建子节点
    $: childNodes = children.map(childPath => {
        return childPath.startsWith(path) ? childPath.substr(path.length + 1) : null;
    }).filter(Boolean);
</script>

<div>
    <span on:click={() => isOpen = !isOpen}>{parts[parts.length - 1]}</span>
    {#if isOpen && childNodes.length > 0}
        <div class="children">
            {#each childNodes as childNode}
                <TreeNode path={`${path}/${childNode}`} {children} />
            {/each}
        </div>
    {/if}
</div>

<style>
    .children {
        padding-left: 1em;
    }
</style>
