<script lang="ts">
  import { fly } from 'svelte/transition'
  export let message: string
  export let type: 'success' | 'error' = 'success'
</script>

<div
  class="fixed top-6 left-1/2 z-[60] max-w-sm -translate-x-1/2 px-5 py-4 font-body shadow-lg"
  class:bg-white={type === 'success'}
  class:border={type === 'success'}
  class:border-border={type === 'success'}
  class:text-ink={type === 'success'}
  class:bg-primary={type === 'error'}
  class:text-white={type === 'error'}
  transition:fly={{ y: -20, duration: 250 }}
  role={type === 'error' ? 'alert' : 'status'}
>
  {message}
</div>