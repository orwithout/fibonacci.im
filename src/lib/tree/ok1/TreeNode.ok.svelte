<script>

    import { slide } from 'svelte/transition';

    import TreeItemButton from '$lib/tree/TreeItemButton.svelte';



    export let entries;
    export let isRoot = false;
    // 用于跟踪entries是否已经加载
    let isFolderStatusReady = false;
    $: if (isRoot) { isFolderStatusReady = Object.keys(folderStatus).length === entries.length; 
    } else { isFolderStatusReady = true; }




    let isOpen = false;
    let selectedFile = null;
    export let path;




    // 同时计算 children 和 folderStatus
    let children = [];
    let folderStatus = {};
    const isFolder = (path) => folderStatus[path] || false;
    function sortEntries(a, b) {
        const isFolderA = isFolder(a[0]);
        const isFolderB = isFolder(b[0]);
        if (isFolderA && !isFolderB) { return -1; } // 如果 a 是目录而 b 不是，a 排在前面
        if (!isFolderA && isFolderB) { return 1; } // 如果 b 是目录而 a 不是，b 排在前面
        return 0; // 如果都是目录或都不是，则保持原来的顺序
    }

    
    // 在计算 children 时应用排序
    const basePath = path + '/';
    $: {
        children = [];
        folderStatus = {};
        entries.forEach(entry => {
            const isDirectChild = entry[0].startsWith(basePath) && !entry[0].slice(path.length + 1).includes('/');
            const isChildFolder = entries.some(e => e[0].startsWith(entry[0] + '/'));
            if (isDirectChild) { children.push(entry); }
            folderStatus[entry[0]] = isChildFolder;
        });
        children.sort(sortEntries);
    }

    

    function toggle() {
        isOpen = !isOpen;
    }

    function selectFile(file) {
        selectedFile = (selectedFile === file) ? null : file;
    }
</script>



<ul>
    {#if isFolderStatusReady}
        <TreeItemButton {path} {isOpen} isFolder={isFolder(path)} {selectedFile} onToggle={toggle} onSelect={selectFile} />
        {#if isOpen && children.length}
            <div transition:slide={{ duration: 233 }}>
                {#each children as child}
                <li>
                    <svelte:self path={child[0]} {entries} />
                </li>
                {/each}
            </div>
        {/if}
    {:else}
        <p>Loading...</p>
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