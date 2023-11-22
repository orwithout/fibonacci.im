<!-- 数据结构请参考官方，这里添加了按钮点击 https://svelte.dev/examples/svelte-self -->

<script>
	import File from '../tree/File.svelte';
	import { slide } from 'svelte/transition';

	export let expanded = false;
	export let name;
	export let files;

	function toggle() {
		expanded = !expanded;
	}
</script>

<button
    on:click={toggle}
    on:keydown={event => {if (event.key === 'Space') toggle()}}
    class:expanded>
    {name}
</button>


{#if expanded}
	<ul transition:slide={{ duration: 300 }}>
		{#each files as file}
			<li>
				{#if file.type === 'folder'}
					<svelte:self {...file} />
				{:else}
					<File {...file} />
				{/if}
			</li>
		{/each}
	</ul>
{/if}

<style>
	button {
		padding: 0 0 0 1.5em;
		background: url(/icons/folder.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
		border:none;
		font-size:14px;
	}

	.expanded {
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

	button:focus {
    /* outline: 2px solid blue; 明显的轮廓颜色 */
    outline-offset: 2px;     /* 轮廓偏移，可以根据需要调整 */
}
</style>




<!-- 调用方法： 

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

{#each Object.entries(option) as [key, value]}
    <Explorer name="Home" files={root} expanded />
	
{/each}

{#each Object.entries(topLevelInfoset) as [key, value]}
    {#each value as entry}
        <TreeNode path={entry[0]} entries={infoset[key]} />
    {/each}
{/each}











-->