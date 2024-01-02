<script>
    import Folder from '$lib/entryTree/folder.svelte';
    import File from '$lib/entryTree/file.svelte';
    import { infoBase } from '$lib/entry/STORE.js';
    import { isFolder, sortEntries, GetChildEntries } from '$lib/entry/fileSystemUtils';
    
    export let primaryKey;
    export let path;
    $: entries = $infoBase[primaryKey] || []; // 确保 entries 总是数组

    
    // let children = [];
    // let folderStatus = {};

    // 响应式更新 children 和 folderStatus
    // $: children = processChildEntries(entries, path + '/', isFolder);
    // $: children = GetChildEntries(entries, path + '/');
    $: children = GetChildEntries(entries, path + '/').sort((a, b) => sortEntries(a, b, entries));
    
    let shouldApplyBorderStyle = path.includes('/');
</script>


<ul class:border={shouldApplyBorderStyle}>
    
    {#if isFolder(path, entries)}

        <Folder {primaryKey} {path} {children} />

    {:else}
        <File {primaryKey} {path} {children} />
    {/if}

</ul>

<style>

/* ↻↻ ❯*/

    ul {
        padding: 0.2em 0 0 0;  /* 将左内边距设置为0 */
        margin: 0 0 0 0;      /* 将左边距设置为0 */ 
        /* list-style: none; */
        /* border-left: 1px solid #eee; */
    }
    ul.border {
        padding: 0.2em 0 0 0.5em;
        margin: 0 0 0 0.74em;
        border-left: 1px solid #eee;
    }
</style>