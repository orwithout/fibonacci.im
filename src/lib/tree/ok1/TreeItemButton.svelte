<script>
    export let path;
    export let isOpen;
    export let isFolder;
    export let selectedFile;
    export let onToggle;
    export let onSelect;

    const displayName = path.split('/').pop();
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

    function handleClick() {
        if (isFolder) {
            onToggle();
        } else {
            onSelect(path);
        }
    }
    
</script>



<button on:click={handleClick}
    class:expanded={isOpen && isFolder}
    class:file={!isFolder}
    class:selected={selectedFile === path && !isFolder}
    aria-expanded={isOpen}>
    {#if !isFolder}
        <img class="icon"
            src={`/icons/file-type-${getFileExtension(path)}.svg`} 
            alt="File Icon" 
            on:error={handleIconError} />
    {/if}
    {displayName}
</button>




<style>
    button {
        padding: 0 0 0 1.8em;
		background: url(/icons/folder.svg) 0 0.1em no-repeat;
		background-size: 1.5em 1.5em;
		font-weight: bold;
		cursor: pointer;
		border:none;
		font-size:14px;
        background-position: center left;
    }

    button.expanded {
        background-image: url(/icons/folder-open.svg);
		background-color: #e9d9d9;
    }

    button.file {
        background: none;
        font-weight: normal;
    }
    button.file.selected {
        background-color: #e9d9d9;
    }


    .icon {
        margin-left: -1.8em;
        width: 1.3em;
        height: 1.3em;
        vertical-align: middle;
    }







</style>
