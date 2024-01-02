<script>
	import { onMount } from 'svelte';
	import { parseURLParameters, parseJSONParameters, fetchDataForParams, mergeWithAppend, loadComponents } from '$lib/entry/getopt.js';
	import { inputUrl, inputJson, infoSet, infoBase, components } from '$lib/entry/STORE.js';



	onMount(async () => {
		const defaultUrl = `senseurl==${window.location.origin}/entryConfig.json`;

		const defaultInfo = {};

		const paramsString = window.location.search.slice(1).length === 0 ? defaultUrl : window.location.search.slice(1);
		console.log("paramsString:", paramsString);
		const parsedInputUrl = await parseURLParameters(paramsString);

		const parsedInputJson = await parseJSONParameters(paramsString);



		const fetchedData = await fetchDataForParams(parsedInputUrl);

		// 同键替换
		inputUrl.set({ ...parsedInputUrl, ...(parsedInputJson.inputUrl || {}) });
		inputJson.set(parsedInputJson);
		// infoSet.set({ ...defaultInfo, ...fetchedData, ...(parsedInputJson.infoSet || {}) });
		
		infoSet.set({ ...defaultInfo, ...fetchedData});

		// 同键追加
		
		infoSet.set(mergeWithAppend($infoSet, (parsedInputJson.infoSet || {})));

		infoBase.set(mergeWithAppend($inputUrl, $infoSet));
		
		

		console.log("inputUrl:", $inputUrl);
		console.log("inputJson:", $inputJson);
		console.log("infoSet:", $infoSet);
		console.log("infoBase:", $infoBase);
		// 假设 $inputUrl 和 $infoSet 是从 Store 中获得的值


		const moduleRegex = /(?<=\$)lib(\/[^\$]+)+\.(js|svelte)(?=[#\/]mainColumn.(\d+).senseurl.x)/;
		if (Object.keys($infoBase).length > 0) {
			components.set(await loadComponents($infoBase, moduleRegex, 3));
			console.log("components:", $components);
		}
		// console.log("infoBase:", $infoBase);
	});
</script>

<div class="keys-container">
    {#if Object.keys($components).length > 0}
        {#each Object.keys($infoBase) as key}
            <div class="value-container">
				{#if $components[key]}
					<svelte:component this={$components[key][0]} primaryKey={key}/>
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
		flex-direction: column;
	}

</style>

