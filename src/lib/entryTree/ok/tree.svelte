<script>
    import TreeNode from '$lib/entryHandler/TreeNode.svelte';
	import { inputUrl, infoBase } from '/src/entryStore.js';


	export let primaryKey;
	$: urls = $inputUrl[primaryKey];
	$: paths = $infoBase[primaryKey];

    $: topLevelUrls = urls.filter(entry => !entry[0].includes('/'));
    $: topLevelpaths = paths.filter(entry => !entry[0].includes('/'));

</script>


{#each topLevelUrls as entry}
    <TreeNode path={entry[0]} entries={urls} />
{/each}


{#each topLevelpaths as entry}
    <TreeNode path={entry[0]} entries={paths} />
{/each}

