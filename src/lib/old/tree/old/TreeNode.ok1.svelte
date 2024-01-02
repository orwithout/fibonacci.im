<script>
    import TreeNode from './TreeNode.svelte';
    import { slide } from 'svelte/transition';

    // entries 为二维数组格式类似：
    // [["lib", "http://127.0.0.1:8002/0/a01_tree", "tag1"],
    //  ["lib/tree.svelte", "http://127.0.0.1:8002/0/a01_tree", "tag2","tag3","tagx"]]
    export let entries;
    export let path;
    const basePath = path + '/';
    // 当path或entries变化时，更新children
    $: children = entries.filter(entry =>
        entry[0].startsWith(basePath) && 
        !entry[0].slice(path.length + 1).includes('/')
    );

    // 用于切换展开折叠状态的函数
    let isOpen = false;
    function toggle() {
        isOpen = !isOpen;
    }

</script>



<!-- 直接使用内部的 ul，移除外层 ul 和 li -->
<button on:click={toggle} class:expanded={isOpen} aria-expanded={isOpen}>
    {path.split('/').pop()}
</button>

<ul>
    {#if isOpen && children.length}
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



    button {
        padding: 0 0 0 1.8em;
		background: url(/icons/folder.svg) 0 0.1em no-repeat;
		background-size: 1.5em 1.5em;
		font-weight: bold;
		cursor: pointer;
		border:none;
		font-size:14px;
        background-position: center left;
    }

    button.expanded {
        background-image: url(/icons/folder-open.svg);
		background-color: #b4b4b4;
    }




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
