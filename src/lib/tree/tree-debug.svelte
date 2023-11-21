<!-- 子组件（例如 HelloWorld.svelte） -->
<script>
    export let entries = [];
    let tree = {};

    // 递归地创建树
    function createTree(paths) {
        let tree = {};

        paths.forEach(path => {
            let currentLevel = tree;
            path[0].split('/').forEach(part => {
                currentLevel[part] = currentLevel[part] || {};
                currentLevel = currentLevel[part];
            });
        });

        return tree;
    }


    $: if (entries && entries.length > 0) {
        tree = createTree(entries);
        console.log('传入的数组:', tree);
    }
</script>

<div>
    {#each entries as item}
        <div>Item: {item}</div>
    {/each}
</div>


<!-- let paths = [['path1', ...], ['path2', ...], ['path3', ...]];
let pathStrings = paths.map(path => path[0]);

// 假设您要查找的值是 'path2'
let valueToFind = 'path2';
let index = pathStrings.findIndex(element => element === valueToFind);

console.log(index); // 这将输出 'path2' 在 pathStrings 中的索引，也是它在 paths 中的索引 -->
