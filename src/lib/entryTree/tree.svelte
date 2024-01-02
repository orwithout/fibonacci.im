<script>
    import Expand from '$lib/entryTree/expand.svelte';
    import { infoBase } from '$lib/entry/STORE.js';
    import { sortEntries, GetChildEntries } from '$lib/entry/fileSystemUtils';
    import { deleteObjectStoreIfEmpty } from '$lib/indexedDB/common.js';

    export let primaryKey;

    $: topLevelpaths = GetChildEntries($infoBase[primaryKey], '').sort((a, b) => sortEntries(a, b, $infoBase[primaryKey]));

    // 如果主键为空，删除 indexedDB 中对应的 objectStore
    $: if ($infoBase[primaryKey] && $infoBase[primaryKey].length === 0) {
        deleteObjectStoreIfEmpty(primaryKey);
    }

</script>




{#each topLevelpaths as path}
    <Expand {primaryKey} {path}/>
{/each}



