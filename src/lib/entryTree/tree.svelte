<script>
    import Expand from '$lib/entryTree/expand.svelte';
    import { infoBase } from '$lib/entry/STORE.js';

    export let primaryKey;

    function uniqueTopLevel(entries) {
        const unique = new Set();
        entries.filter(entry => !entry[0].includes('/')).forEach(entry => unique.add(entry[0]));
        return unique;
    }

    $: topLevelpaths = uniqueTopLevel($infoBase[primaryKey]);
</script>


{#each topLevelpaths as path}
    <Expand {primaryKey} {path}/>
{/each}



