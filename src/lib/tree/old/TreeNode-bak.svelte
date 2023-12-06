<script>
    import TreeNode from './TreeNode-bak.svelte';
	import { slide } from 'svelte/transition';
    export let path; // 该节点的完整路径
    export let entries; // 所有条目

    let isOpen = false;
    let children = [];

    // 当path或entries变化时，更新children
    // 获取当前路径下一级的路径
    // 检查是否直接在当前路径下，以为是之间子路径 所有排除去掉当前处理路径后，仍然含 / 的
    $: { children = entries.filter(entry => { return entry[0].startsWith(path + '/') && !entry[0].slice(path.length + 1).includes('/'); }); }
</script>



<ul transition:slide={{ duration: 144 }}>
    <span on:click={() => isOpen = !isOpen}>{path.split('/').pop()}</span>
    {#if isOpen && children.length}
        <li class="children">
            {#each children as child}
                <TreeNode path={child[0]} {entries} />
            {/each}
        </li>
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
    .children {
        padding-left: 1em;
    }
</style>
