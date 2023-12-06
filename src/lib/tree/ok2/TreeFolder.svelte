<script>
    export let path;
    export let handleButtonClick;
    export let isOpen;
    export let displayName;

    // 你可以添加文件夹特有的逻辑和状态
</script>

<button on:click={handleButtonClick}
        class:expanded={isOpen}
        aria-expanded={isOpen}>
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


</style>
