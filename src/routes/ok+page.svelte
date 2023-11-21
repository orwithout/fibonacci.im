
<script>
	import { onMount } from 'svelte';
	import { initializePageData } from '$lib/getopt';



	let options = {};
	let infoBase = {};
	onMount(() => {
        options = window.location.search.slice(1);
        initializePageData({"a00": [[`${window.location.origin}/0/a00`,""]]}, {}, options, "infoBase", (result)=>{options=result;}, (result)=>{infoBase=result;})
    });




	let components = {};
	async function loadComponents() {
		const regex = /^lib(\/.+)+$/;
		const loadPromises = [];

		for (const [key, value] of Object.entries(infoBase)) {
			const matchingItem = value.find(item => regex.test(item[0]));
			if (matchingItem) {
				console.log(`处理键：${key}`);
				loadPromises.push(
					import(/* @vite-ignore */`/src/${matchingItem[0]}`)
						.then(module => {components[key] = module.default;})
						.catch(error => {console.error(`加载组件失败：${matchingItem[0]}`, error);})
				);
			}
		}
		await Promise.all(loadPromises);
	}


	
	$: if (Object.keys(infoBase).length > 0) { loadComponents(); }

    
</script>




<div class="keys-container">
    {#if Object.keys(components).length > 0}
        {#each Object.entries(infoBase) as [key, value]}
		<div class="value-container">
            {#if components[key]}
                <svelte:component this={components[key]} entries={value} />
            {/if}
		</div>
        {/each}
    {/if}
</div>




<style>
	.keys-container {
		display: flex;
		white-space: nowrap;
		gap: 5em;
	}

	.value-container {
		/* display: flex; */
		flex-direction: column;
	}

</style>

