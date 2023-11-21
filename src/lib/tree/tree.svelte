<script>
    import TreeNode from '$lib/tree/TreeNode.svelte';
	import Explorer from '$lib/tree//Explorer.svelte';

    export let option = [];
    export let infoset = [];


    let root = [
		{
			type: 'folder',
			name: 'Important work stuff',
			files: [{ type: 'file', name: 'quarterly-results.xlsx' }]
		},
        { type: 'file', name: 'monkey-on-a-pig.gif' },
		{
            
            type: 'folder',
			name: 'Animal GIFs',
			files: [
				{
					type: 'folder',
					name: 'Dogs',
					files: [
						{ type: 'file', name: 'treadmill.gif' },
						{ type: 'file', name: 'rope-jumping.gif' }
					]
				},
				{
					type: 'folder',
					name: 'Goats',
					files: [
						{ type: 'file', name: 'parkour.gif' },
						{ type: 'file', name: 'rampage.gif' }
					]
				},
				{ type: 'file', name: 'cat-roomba.gif' },
				{ type: 'file', name: 'duck-shuffle.gif' }
			]
		},
		{ type: 'file', name: 'TODO.md' }
	];


    // 预处理 infoset
    let topLevelInfoset = {};

    $: topLevelInfoset = Object.fromEntries(
        Object.entries(infoset).map(([key, value]) => [key, value.filter(entry => !entry[0].includes('/'))])
    );
</script>

<!-- 处理并渲染 option -->
{#each Object.entries(option) as [key, value]}
    <Explorer name="Home" files={root} expanded />
	
{/each}

<!-- 处理并渲染 infoset -->
{#each Object.entries(topLevelInfoset) as [key, value]}
    {#each value as entry}
        <TreeNode path={entry[0]} entries={infoset[key]} />
    {/each}
{/each}







