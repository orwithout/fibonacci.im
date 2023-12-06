
<script>
	import { onMount } from 'svelte';
	import { initializePageData } from '$lib/getopt';
	let options = {};
	let infoBase = {};

	// 从 url 中获取参数
	// 示例: http://localhost:8005/?a00==http://127.0.0.1:8002/0/a00?v1=x&v2=y|tag1;http://127.0.0.1:8002/0/a01|tag2;;a02==http://127.0.0.1:8002/0/a01;;infoBase=={"k1":["v1","v2"],"k2":["v2"]}
	
	// 来看一下，示例 url 组成部分：
	// http://localhost:8005/?
	// a00==http://127.0.0.1:8002/0/a00?v1=x&v2=y|tag1;http://127.0.0.1:8002/0/a01|tag2;;
	// a02==http://127.0.0.1:8002/0/a01;;
	// infoBase=={"k1":["v1","v2"],"k2":["v2"]}

	// 所以示例 url 是使用 ? 分割 路径与参数部分
	// 参数赋值 使用 key == value 格式
	// 参数分两类：一类是 网址组 ，一类是 json 对象
	// 多个参数使用 ;; 分割
	
	// 对于 网址组 参数
	// 使用 ; 分割同一个参数的多个 网址
	// 使用 | 分割每个网址的属性
	
	onMount(() => {

		// 以示例 url 为例, options 将被赋值为:
		// a00==http://127.0.0.1:8002/0/a00?v1=x&v2=y|tag1;http://127.0.0.1:8002/0/a01|tag2;;a02==http://127.0.0.1:8002/0/a01;;infoBase=={"k1":["v1","v2"],"k2":["v2"]}
		// 稍后将会被解析为(infoBase最后会被摘出来合并到当前 infoBase 全局变量，并从options删除 )：
		// {
		// 	"a00": [
		// 		["http://127.0.0.1:8002/0/a00?v1=x&v2=y","tag1"],
		// 		["http://127.0.0.1:8002/0/a01","tag2"]
		// 	],
		// 	"a02": [
		// 		["http://127.0.0.1:8002/0/a01",""]
		// 	],
		// 	"infoBase": {"k1":["v1","v2"],"k2":["v2"]}
		// }
        options = window.location.search.slice(1);


		// 第一个参数是 options 为空时的默认值
		// 第二个参数 infoBase 的初始值,可以被合并
		// 第三个参数,带有链接，会请求链接的返回，返回的数据会被合并到 infoBase
		// 第四个参数指定 infoBase 的key 用于将 url 的 infobase=={……}的{……}合并到 infoBase
		// 第五、六个参数是回调函数,用于处理 options，infoBase
		// 所以 infoBase 是多方数据合并而来，合并顺序是: infoBase 初始值 < url 参数请求的返回 < 指定的 url 参数中的 key 的值
        initializePageData({"a00": [[`${window.location.origin}/0/a00`,""]]}, {}, options, "infoBase", (result)=>{options=result;}, (result)=>{infoBase=result; loadComponents(); })


		
    });




    let components = {};

	

    // 加载所有需要的组件
	async function loadComponents() {
		// console.log(`初始infoBase: ${JSON.stringify(infoBase)}`);
		const regex = /^lib(\/.+)+$/; // 根据你的需求调整正则表达式

		for (const [key, value] of Object.entries(infoBase)) {
			// console.log(`处理键：${key}`);
			for (const item of value) {
				if (regex.test(item[0])) { // 检查数据是否符合正则表达式
					// console.log(`匹配的组件路径：${item[0]}`);
					try {
						const component = await import("/src/" + item[0]);
						components[key] = await component.default;
						console.log(`成功加载组件：${components[key]}`);
					} catch (error) {
						console.error(`加载组件失败：${item[0]}`, error);
					}
					break; // 假设每个 key 只需要加载一个组件
				}
			}
		}
		console.log(`组件加载完成：${components["a00"]}`);
	}


    
</script>

{#each Object.entries(infoBase) as [key, value]}
    {#if components[key]}
        <svelte:component this={components[key]} data={value} />
        {console.log(`渲染组件：${key}`)}
    {:else}
        {console.log(`未找到组件渲染：${key}`)}
    {/if}
{/each}
