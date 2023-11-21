
<script>
	import { onMount } from 'svelte';
	import { initializePageData } from '$lib/batch/getopt';
	let infoUrl = {};
	let infoBase = [];

	// 从 url 中获取参数
	// 示例: http://localhost:5173/batch?a00==http://127.0.0.1:8002/0/a00?v1=x&v2=y|a00_show==http://127.0.0.1:8002/0/a01?v3=1&v4=0|infoBase=={"k1":["v1","v2"],"k2":["v2"]}
	
	// 来看一下，示例 url 组成部分：
	// http://localhost:5173/batch?
	// a00==http://127.0.0.1:8002/0/a00?v1=x&v2=y|
	// a00_show==http://127.0.0.1:8002/0/a01?v3=1&v4=0|
	// infoBase=={"k1":["v1","v2"],"k2":["v2"]}

	// 所以示例 url 是使用 ? 分割 路径与参数部分
	// 参数赋值 使用 key == value 格式
	// 参数分两类：一类是 网址组 ，一类是 json 对象
	// 多个参数使用 | 分割
	
	
	onMount(() => {

		// 以示例 url 为例, options 将被赋值为:
		// a00==http://127.0.0.1:8002/0/a00?v1=x&v2=y|a00_show==http://127.0.0.1:8002/0/a01?v3=1&v4=0|infoBase=={"k1":["v1","v2"],"k2":["v2"]}
		// 稍后将会被解析为(infoBase最后会被摘出来合并到当前 infoBase 全局变量，并从options删除 )：
		// {
		// 	"a00": "http://127.0.0.1:8002/0/a00?v1=x&v2=y",
		// 	"a00_show": "http://127.0.0.1:8002/0/a01?v3=1&v4=0",
		// 	"infoBase": {"k1":["v1","v2"],"k2":["v2"]}
		// }
        infoUrl = window.location.search.slice(1);


		// 第一个参数是 options 为空时的默认值
		// 第二个参数 infoBase 的初始值,可以被合并
		// 第三个参数,带有链接，会请求链接的返回，返回的数据会被合并到 infoBase
		// 第四个参数指定 infoBase 的key 用于将 url 的 infobase=={……}的{……}合并到 infoBase
		// 第五、六个参数是回调函数,用于处理 options，infoBase
		// 所以 infoBase 是多方数据合并而来，合并顺序是: infoBase 初始值 < url 参数请求的返回 < 指定的 url 参数中的 key 的值
        initializePageData({"a00":`${window.location.origin}/0/a00`}, {}, infoUrl, "infoBase", (result)=>{infoUrl=result;}, (result)=>{infoBase=result;})
    });
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
