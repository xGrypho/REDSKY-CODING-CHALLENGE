<script lang="ts">
  import type { User, UserInput } from '../types/user'

  export let onClose: () => void
  export let onSubmit: (user: UserInput) => Promise<void>

  export let initialUser: User | null = null
  export let title = 'Create New User'
  export let submitLabel = 'Create'  

  let newUser: UserInput = {
    first_name: '',
    last_name: '',
    email: '',
    avatar: '',
  }

  $: if (initialUser) {
    newUser = {
        first_name: initialUser.first_name,
        last_name: initialUser.last_name,
        email: initialUser.email,
        avatar: initialUser.avatar,
    }
  }else {
    newUser = {
        first_name: '',
        last_name: '',
        email: '',
        avatar: '',
    }
  }

  async function handleSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault()
    await onSubmit(newUser) 
  }
</script>

<div
  class="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
  role="dialog"
  aria-modal="true"
  aria-labelledby="create-user-title"
>
  <div class="w-full max-w-xl bg-white">
    <header class="bg-primary px-6 py-5">
      <h2
        id="create-user-title"
        class="font-body text-[24px] leading-[29px] font-semibold uppercase text-white"
      >
        {title}
      </h2>
    </header>

    <form class="space-y-5 p-6" onsubmit={handleSubmit}>
      <label class="block">
        <span class="form-label">First Name</span>
        <input class="form-input" bind:value={newUser.first_name} required />
      </label>

      <label class="block">
        <span class="form-label">Last Name</span>
        <input class="form-input" bind:value={newUser.last_name} required />
      </label>

      <label class="block">
        <span class="form-label">Email Address</span>
        <input type="email" class="form-input" bind:value={newUser.email} required />
      </label>

      <label class="block">
        <span class="form-label">Avatar Image Link</span>
        <input type="url" class="form-input" bind:value={newUser.avatar} required />
      </label>

      <div class="flex justify-end gap-4 pt-4">
        <button type="button" class="button-secondary" onclick={onClose}>
          Cancel
        </button>

        <button type="submit" class="button-primary">{submitLabel}</button>
      </div>
    </form>
  </div>
</div>
