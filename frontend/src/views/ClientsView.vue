<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchClients, type Client } from '@/api/clients'

const clients = ref<Client[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const search = ref('')

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase()
  return clients.value.filter((c) => c.name.toLowerCase().includes(query) || c.inn.includes(query))
})

async function load() {
  loading.value = true
  error.value = null
  try {
    clients.value = await fetchClients()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <h1 class="clients__title">Клиенты</h1>

  <input
    v-model="search"
    class="clients__search"
    type="search"
    placeholder="Поиск по названию или ИНН"
  />

  <p v-if="loading" class="clients__status">Загрузка...</p>
  <p v-else-if="error" class="clients__status clients__status--error">Ошибка: {{ error }}</p>
  <p v-else-if="clients.length === 0" class="clients__status">Клиентов пока нет</p>
  <p v-else-if="filtered.length === 0" class="clients__status">Ничего не найдено</p>
  <ul v-else class="clients__list">
    <li v-for="client in filtered" :key="client.id" class="clients__item">
      <span>{{ client.name }}</span>
      <span class="clients__inn">ИНН {{ client.inn }}</span>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.clients {
  &__title {
    margin: 24px 0 16px;
  }

  &__search {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
  }

  &__status {
    color: #6b7280;

    &--error {
      color: #dc2626;
    }
  }

  &__list {
    margin: 16px 0 0;
    padding: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #e5e7eb;
  }

  &__inn {
    color: #6b7280;
  }
}
</style>
