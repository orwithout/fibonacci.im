<script>
    import Folder from '$lib/entryTree/folder.svelte';
    import File from '$lib/entryTree/file.svelte';
    import { infoBase } from '$lib/entry/STORE.js';
    
    
    export let primaryKey;
    export let path;
    $: entries = $infoBase[primaryKey];

    function sortEntries(a, b) {
        const isFolderA = isFolder(a);
        const isFolderB = isFolder(b);
        if (isFolderA && !isFolderB) { return -1; } // 文件夹先于文件
        if (!isFolderA && isFolderB) { return 1; } // 文件后于文件夹
        return a.localeCompare(b); // 同为文件或文件夹时，按字母顺序排序
    }



    const basePath = path + '/';
    let children = [];
    // $: children = children || [];

    let folderStatus = {};
    const isFolder = (path) => folderStatus[path] || false;


    $: {
        // 使用 set 来自动去重
        let childEntries = new Set();
        folderStatus = {};
        entries.forEach(entry => {
            const isDirectChild = entry[0].startsWith(basePath) && !entry[0].slice(path.length + 1).includes('/');
            const isChildFolder = entries.some(e => e[0].startsWith(entry[0] + '/'));
            if (isDirectChild) childEntries.add(entry[0]); // 添加唯一路径到 Set 中
            folderStatus[entry[0]] = isChildFolder;
        });
        children = Array.from(childEntries).map(path => path).sort(sortEntries); // 将 Set 转换回数组并排序
    }

</script>

<ul>
    {#if folderStatus}
        {#if isFolder(path)}
            <Folder {primaryKey} {path} {children} />
        {:else}
            <File {primaryKey} {path} {children} />
        {/if}
    {:else}
        <p>Loading...</p>
    {/if}
</ul>

<style>

/* ↻↻ ❯*/

    ul {
        padding: 0.2em 0 0 0.5em;
        margin: 0 0 0 0.74em;
        /* list-style: none; */
        border-left: 1px solid #eee;
    }


    /* li {
        padding: 0.2em 0;
    } */
</style>