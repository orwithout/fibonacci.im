<!-- 数据结构请参考官方，这里添加了按钮点击 https://svelte.dev/examples/svelte-self -->

<script>
	import File from './File.svelte';
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
