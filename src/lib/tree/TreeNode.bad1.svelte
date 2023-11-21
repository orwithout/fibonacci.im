<script>
    import TreeNode from './TreeNode.svelte';
    import { slide } from 'svelte/transition';

    export let entries;
    export let path;
    const basePath = path + '/';
    $: children = entries.filter(entry =>
        entry[0].startsWith(basePath) && 
        !entry[0].slice(path.length + 1).includes('/')
    );

    let isOpen = false;
    function toggle() {
        isOpen = !isOpen;
    }

    // 新增函数：根据路径判断是否为文件夹
    const isFolder = (path) => !path.includes('.');

    // 新增函数：获取文件扩展名
    const getFileExtension = (path) => {
        const parts = path.split('.');
        return parts[parts.length - 1];
    };
</script>

<button on:click={toggle} class:expanded={isOpen} aria-expanded={isOpen}>
    {#if isFolder(path)}
        {path.split('/').pop()}
    {:else}
        {path.split('/').pop()} <img src={`/icons/file-type-${getFileExtension(path)}.svg`} alt="File Icon" />
    {/if}
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


.file-icon, .folder-icon {
    width: 16px; /* 或者其他合适的尺寸 */
    height: 16px;
}



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
