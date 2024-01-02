<script>
    export let path;

    const getFileExtension = (path) => {
        const parts = path.split('.');
        // 如果路径不包含点号或最后一个部分为空（即路径以点号结束），则返回空字符串或"default"
        return parts.length > 1 && parts[parts.length - 1] ? parts[parts.length - 1] : "default";
    };

    function handleIconError(event) {
        const defaultIconSrc = '/icons/file-type-default.svg';
        // 检查是否已经尝试过加载默认图标
        if (event.target.alt !== 'default') {
            event.target.src = defaultIconSrc;
            event.target.alt = 'default'; // 设置标记
        }
    }

    // const displayName = path.split('/').pop();
</script>

<div>
<img class="icon"
    src={`/icons/file-type-${getFileExtension(path)}.svg`} 
    alt="File Icon"
    on:error={handleIconError} />
{path.split('/').pop()}
</div>


<style>
.icon {
    /* margin-left: -1.8em; */
    width: 1.3em;
    height: 1.3em;
    vertical-align: middle;
}

</style>