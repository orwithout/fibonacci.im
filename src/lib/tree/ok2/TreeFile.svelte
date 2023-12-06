<script>
    export let path;
    export let getFileExtension;
    export let handleIconError;
    export let displayName;

    // TreeFile 特有的逻辑和状态
</script>

<button class="file">
    <img class="icon"
        src={`/icons/file-type-${getFileExtension(path)}.svg`} 
        alt="File Icon" 
        on:error={handleIconError} />
    {displayName}
</button>

<style>
    .file {
        /* 这里添加原 TreeNode 组件中文件按钮的样式 */
        background: none;
        font-weight: normal;
        /* 其他必要样式 */
    }

    .icon {
        /* icon 相关的样式 */
        /* margin-left: -1.8em; */
        width: 1.3em;
        height: 1.3em;
        vertical-align: middle;
    }
</style>
