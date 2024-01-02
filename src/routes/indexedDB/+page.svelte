<script>
    import { getAllFiles } from '$lib/indexedDB/value.js';
    import { onMount } from 'svelte';
  
    let files = [];
  
    onMount(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const storeName = queryParams.get('storename');
      console.log("storeName:", storeName);
      if (storeName) {
        loadFiles(storeName);
      }
    });
  
    async function loadFiles(storeName) {
      files = await getAllFiles(storeName);
      console.log("files:", files);
    }
  </script>
  
  {#each files as file}
    <div>
      {file.someProperty}
    </div>
  {/each}
  