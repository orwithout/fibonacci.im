<script>
	import { onMount } from 'svelte';
	import { parseURLParameters, parseJSONParameters, fetchDataForParams, mergeWithAppend, loadComponents, mergeIntoKey } from '$lib/entry/getopt.js';
	import { urlSet, infoBase, components } from '$lib/entry/STORE.js';
	import { upgradeDB } from '$lib/indexedDB/common.js';



	onMount(async () => {
		// 设置默认参数 和 获取 URL 参数
		const defaultUrl = `senseurl==${window.location.origin}/entryDefault.json`;
		let localsearch = window.location.search.slice(1);
		localsearch = `${defaultUrl};;${localsearch}`;
		console.log("localsearch:", localsearch);
		console.log("localsearch:", window.location.hostname);
		
		// 从参数中解析出 urlSet 和 inputJson
		const parsedInputUrl = await parseURLParameters(localsearch);
		const parsedInputJson = await parseJSONParameters(localsearch);
		// 如果url 中带入了json 则将其中的参数合并到 urlSet 中
		urlSet.set({ ...parsedInputUrl, ...(parsedInputJson.urlSet || {}) });
		// inputJson.set(parsedInputJson);

		// 从 urlSet 中获取数据
		const fetchedData = await fetchDataForParams($urlSet);
		// 同键替换		
		// infoSet.set({ ...defaultInfo, ...fetchedData});
		// infoSet.set({ ...defaultInfo, ...fetchedData, ...(parsedInputJson.infoSet || {}) });
		// 同键追加
		infoBase.set(mergeWithAppend(fetchedData, (parsedInputJson.infoBase || {})));
		infoBase.set(mergeWithAppend($urlSet, $infoBase));
		urlSet.set(mergeIntoKey($urlSet, 'senseurl'));
		
		

		console.log("urlSet:", $urlSet);
		// console.log("inputJson:", $inputJson);
		// console.log("infoSet:", $infoSet);
		console.log("infoBase:", $infoBase);
		// 假设 $urlSet 和 $infoSet 是从 Store 中获得的值


		// 从数据中加载组件
		const moduleRegex = /(?<=\$)lib(\/[^\$]+)+\.(js|svelte)(?=[#\/]mainColumn.(\d+).senseurl.x)/;
		if (Object.keys($infoBase).length > 0) {
			components.set(await loadComponents($infoBase, moduleRegex, 3));
			console.log("components:", $components);
		}
		// console.log("infoBase:", $infoBase);


		// 初始化 indexedDB 回收站
		upgradeDB("RecycleBin", "create")

	});

</script>

{#if Object.keys($components).length > 0}
	{#if $infoBase.senseurl && $components['senseurl']}
		<div class="value-container">
			<svelte:component this={$components['senseurl'][0]} primaryKey="senseurl"/>
		</div>
	{/if}
	<br>
    <!-- <p class="notice">2023年11月21日 (更多仍在建设中...)</p> -->
	<div class="keys-container">
			{#each Object.keys($infoBase) as key}
				{#if key !== 'senseurl'}
					<div class="value-container">
						{#if $components[key]}
							<svelte:component this={$components[key][0]} primaryKey={key}/>
						{/if}
					</div>
				{/if}
			{/each}
	</div>
{/if}

<style>
	.keys-container {
		display: flex;
		white-space: nowrap;
		gap: 5em;
	}

	.value-container {
		flex-direction: column;
	}
	/* .notice {
            color: #777777;
            font-size: 0.9em;
            margin-top: 30px;
            border-top: 1px solid;
            padding-top: 10px;
        } */
</style>

