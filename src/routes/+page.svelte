<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
  import { get } from 'svelte/store';

  if (browser) {
    // 跳转到新路径 并保留 url中的所有参数
    goto(`/entryHandler` + get(page).url.search);
  }
</script>
