<script>
    import TreeFolder from '$lib/tree/TreeFolder.svelte';
    import TreeFile from '$lib/tree/TreeFile.svelte';

    export let entries = []; 
    export let path;


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


    const basePath = path + '/';
    let children = [];
    let folderStatus = {};
    const isFolder = (path) => folderStatus[path] || false;
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

{#if folderStatus}
    {#if isFolder(path)}
        <TreeFolder path={path} {children} {entries} />
    {:else}
        <TreeFile path={path} />
    {/if}
{:else}
    <p>Loading...</p>
{/if}
