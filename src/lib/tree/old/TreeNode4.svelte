<script>
    import TreeNode from '$lib/TreeNode.svelte';
    import { slide } from 'svelte/transition';

    export let entries;
    export let path;
    export let isRoot = false;
    const basePath = path + '/';

    // 用于跟踪entries是否已经加载
    let isFolderStatusReady = false;
    $: if (isRoot) {
        isFolderStatusReady = Object.keys(folderStatus).length === entries.length;
    } else {
        isFolderStatusReady = true;
    }


    let isOpen = false;
    let selectedFile = null;

    $: isCurrentFolder = isFolder(path);
    $: displayName = path.split('/').pop();
    

    

    function handleButtonClick() {
        isOpen = !isOpen;
        if (!isCurrentFolder) {
            selectedFile = (selectedFile === path) ? null : path;
        }
    }



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

    // 同时计算 children 和 folderStatus
    let children = [];
    let folderStatus = {};
    const isFolder = (path) => folderStatus[path] || false;


    function sortEntries(a, b) {
        const isFolderA = isFolder(a[0]);
        const isFolderB = isFolder(b[0]);

        if (isFolderA && !isFolderB) {
            return -1; // 如果 a 是目录而 b 不是，a 排在前面
        }
        if (!isFolderA && isFolderB) {
            return 1; // 如果 b 是目录而 a 不是，b 排在前面
        }
        return 0; // 如果都是目录或都不是，则保持原来的顺序
    }


    // 在计算 children 时应用排序
    $: {
        children = [];
        folderStatus = {};

        entries.forEach(entry => {
            const isDirectChild = entry[0].startsWith(basePath) && !entry[0].slice(path.length + 1).includes('/');
            const isChildFolder = entries.some(e => e[0].startsWith(entry[0] + '/'));

            if (isDirectChild) {
                children.push(entry);
            }

            folderStatus[entry[0]] = isChildFolder;
        });

        children.sort(sortEntries);

    }

</script>



{#if isFolderStatusReady}
    <button on:click={handleButtonClick}
        class:expanded={isOpen && isCurrentFolder}
        class:file={!isCurrentFolder}
        class:selected={selectedFile === path && !isCurrentFolder}
        aria-expanded={isOpen}>
        {#if !isCurrentFolder}
            <img class="icon"
                src={`/icons/file-type-${getFileExtension(path)}.svg`} 
                alt="File Icon" 
                on:error={handleIconError} />
        {/if}
        {displayName}
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
{:else}
    <p>Loading...</p>
{/if}
















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
		background-color: #e9d9d9;
    }

    button.file {
        background: none;
        font-weight: normal;
    }
    button.file.selected {
        background-color: #e9d9d9;
    }


    .icon {
        margin-left: -1.8em;
        width: 1.3em;
        height: 1.3em;
        vertical-align: middle;
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
