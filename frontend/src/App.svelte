<script lang="ts">
import { onMount } from "svelte";
import type { User, UserInput } from './lib/types/user'
import UserModal from './lib/components/UserModal.svelte'
import Toast from './lib/components/Toast.svelte'

let users: User[] = []
let isCreateModalOpen = false
let selectedUser: User | null = null

type ToastType = 'success' | 'error'

type ToastData = {
  message: string
  type: ToastType
}

let toast: ToastData | null = null
let toastTimer: ReturnType<typeof setTimeout> | undefined

function showToast(message: string, type: ToastType = 'success'): void {
  toast = { message, type }

  if (toastTimer) {
    clearTimeout(toastTimer)
  }

  toastTimer = setTimeout(() => {
    toast = null
  }, 3500)
}

async function fetchUsers(): Promise<void> {
  try {
    const response = await fetch('http://localhost:3800/api/users');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: User[] = await response.json();
    users = data
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}

	onMount(() => {
		fetchUsers();
	});

async function createUser(newUser: UserInput): Promise<void>{
  try {
    const response = await fetch('http://localhost:3800/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const createdUser: User = await response.json()

    users = [...users, createdUser]
    isCreateModalOpen = false
    showToast('User created successfully')
  } catch (error) {
    console.error('Failed to create user:', error)
    showToast('Failed to create user', 'error')
  }
}

async function updateUser(id: number, updatedData: UserInput): Promise<void>{
  try {
    const response = await fetch(`http://localhost:3800/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    const updatedUser: User = await response.json()
    users = users.map((user) => (user.id === id ? updatedUser : user))
    isCreateModalOpen = false
    selectedUser = null
    showToast('User updated successfully')
  } catch (error) {
    console.error('Failed to update user:', error)
    showToast('Failed to update user', 'error')
  }
}

async function deleteUser(id: number): Promise<void>{
  try {
    const response = await fetch(`http://localhost:3800/api/users/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    users = users.filter((user) => user.id !== id)
    showToast('User deleted successfully')
  } catch (error) {
    console.error('Failed to delete user:', error)
    showToast('Failed to delete user', 'error')
  }
}

async function saveUser(userInput: UserInput): Promise<void> {
  if (selectedUser) {
    await updateUser(selectedUser.id, userInput)
  } else {
    await createUser(userInput)
  }
}

</script>

<main class="min-h-screen">
  <div class="mx-auto w-full max-w-6xl px-6 py-8">
    <h1 class="font-heading text-[48px] leading-[58px] font-normal uppercase text-ink">
      Redsky Coding Challenge
    </h1>

    <hr class="mt-2 border-0 border-t border-border" />

    <div class="mt-14 flex justify-end">
      <button
        type="button"
        class="button-primary"
        onclick={() => {
          isCreateModalOpen = true
          selectedUser = null
        }}
      >
        Create New User
      </button>
    </div>

    <section class="mt-8 border border-primary">
      <h2 class="bg-primary px-4 py-3 font-body text-[24px] leading-[29px] font-semibold uppercase text-white">
        User List
      </h2>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px] border-collapse text-left font-body text-[18px] leading-[20px] text-ink">
          <thead class="border-b border-border uppercase">
            <tr>
              <th class="px-4 py-4 font-semibold">Avatar</th>
              <th class="px-4 py-4 font-semibold">First Name</th>
              <th class="px-4 py-4 font-semibold">Last Name</th>
              <th class="px-4 py-4 font-semibold">Email Address</th>
              <th class="px-4 py-4"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>

          <tbody>
            {#each users as user (user.id)}
              <tr class="border-b border-border last:border-b-0">
                <td class="px-4 py-2">
                  <img
                    src={`http://localhost:3800/api/users/${user.id}/avatar`}
                    alt={`${user.first_name} ${user.last_name}`}
                    class="h-11 w-11 object-cover"
                  />
                </td>
                <td class="px-4 py-2">{user.first_name}</td>
                <td class="px-4 py-2">{user.last_name}</td>
                <td class="px-4 py-2">{user.email}</td>
                <td class="px-4 py-2">
                  <div class="flex justify-end gap-3">
                    <button
                      type="button"
                      class="button-primary px-3 py-2"
                      onclick={() => {
                        selectedUser = user
                        isCreateModalOpen = true
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" class="button-primary px-3 py-2" onclick={() => deleteUser(user.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  </div>
</main>

{#if isCreateModalOpen}
  <UserModal
    initialUser={selectedUser}
    title={selectedUser ? 'Edit User' : 'Create New User'}
    submitLabel={selectedUser ? 'Save' : 'Create'}
    onClose={() => {
      isCreateModalOpen = false
      selectedUser = null
    }}
    onSubmit={saveUser}
  />
{/if}

{#if toast}
  <Toast message={toast.message} type={toast.type} />
{/if}