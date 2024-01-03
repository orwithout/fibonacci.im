<script>
    import { onMount } from 'svelte';
    import { loadData, upgradeDatabase } from '$lib/dataService';
    import { infoBase, urlSet, components } from '$lib/entry/STORE.js';
    import { loadComponents } from '$lib/entry/getopt.js';
	import { t } from 'svelte-i18n';
    onMount(async () => {
        const inputSearch = window.location.search.slice(1);

        // 当 inputSearch 不为空时，弹出确认框
		if (inputSearch !== '') {
			const confirmMessage = $t('confirmMessage', { inputSearch });
			const confirmMerge = confirm(confirmMessage);
			if (!confirmMerge) {
				return; // 如果用户不确认，停止执行
			}
		}

        // 用户确认后，执行数据加载和合并
        const { mergedInfo, mergedUrl } = await loadData(inputSearch);
        infoBase.set(mergedInfo);
        urlSet.set(mergedUrl);
        console.log("infoBase:", $infoBase);
        console.log("urlSet:", $urlSet);

        if (Object.keys(mergedInfo).length > 0) {
            const moduleRegex = /(?<=\$)lib(\/[^\$]+)+\.(js|svelte)(?=[#\/]mainColumn.(\d+).senseurl.x)/;
            components.set(await loadComponents(mergedInfo, moduleRegex, 3));
        }

        await upgradeDatabase();
    });
</script>

{#if Object.keys($components).length > 0}
	{#if $infoBase.senseurl && $components['senseurl']}
		<div class="value-container">
			<svelte:component this={$components['senseurl'][0]} primaryKey="senseurl"/>
		</div><br>
	{/if}
	<!-- <p class="notice">2023年11月21日 (更多仍在建设中...)</p> -->
	{#each Object.keys($infoBase) as key}
	<div class="keys-container">
		{#if key !== 'senseurl' &&  $components[key]}
			<div class="value-container">
				<svelte:component this={$components[key][0]} primaryKey={key}/>
			</div>
		{/if}
	</div>
	{/each}
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
</style>



<!-- <script>
	import { onMount } from 'svelte';
	import { parseURLParameters, parseJSONParameters, fetchDataForParams, mergeWithAppend, loadComponents, mergeIntoKey } from '$lib/entry/getopt.js';
	import { urlSet, infoBase, components } from '$lib/entry/STORE.js';
	import { upgradeDB } from '$lib/localDB/common.js';



	onMount(async () => {
		// 前端页面代码内置默认数据
		const defaultUrl = await parseURLParameters(`senseurl==${window.location.origin}/entryDefault.json`);
		const defaultInfo = await fetchDataForParams(defaultUrl);

		// 本地 indexedDB 存储的数据
		localUrl = await parseURLParameters(`senseurl==${window.location.origin}/indexedDB?storename=infoBase`);
		const localInfo = await fetchDataForParams(localUrl);

		// 从参数中解析出的数据
		const inputSearch = window.location.search.slice(1);
		const inputJson = await parseJSONParameters(inputSearch);
		const inputUrl = { ...(await parseURLParameters(inputSearch)), ...inputJson.Url || {} };
		const inputInfo = { ...(await fetchDataForParams(inputUrl)), ...inputJson.Info || {} };

		// 各个来源的数据 合并规则
		if (inputSearch === '') {
			infoBase.set({ ...defaultInfo, ...(localInfo || {}) });
			urlSet.set({ ...defaultUrl, ...(localUrl || {}) });
		} else {
			// 同键替换
			infoBase.set({ ...defaultInfo, ...(localInfo || {}) });
			// 同键追加
			infoBase.set(mergeWithAppend($infoBase, (inputInfo || {})));

			urlSet.set({ ...defaultUrl, ...(localUrl || {}) });
			urlSet.set(mergeWithAppend($urlSet, (inputUrl || {})));
		}


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

</script> -->
