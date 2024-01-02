<script>
	export let name;
	export let expanded = false;
	$: type = name.slice(name.lastIndexOf('.') + 1);




	function toggle() {
		expanded = !expanded;
	}





</script>

<!-- <span style="background-image: url(/icons/file-type-{type}.svg)">{name}</span> -->


<button
	style="background-image: url(/icons/file-type-{type}.svg)"

    on:click={toggle}
    on:keydown={event => {if (event.key === 'Space') toggle()}}
    class:expanded> 
    {name}
</button>


<style>
	button {
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
		cursor: pointer;
		border:none;
		
	}
	.expanded {
		background-color: #b4b4b4;
	}
	button:focus {
    /* outline: 2px solid blue; 明显的轮廓颜色 */
    outline-offset: 2px;     /* 轮廓偏移，可以根据需要调整 */
}

</style>
