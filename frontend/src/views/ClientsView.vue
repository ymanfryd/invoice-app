<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchClients, type Client } from '@/api/clients'

const clients = ref<Client[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

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
  <h1>Клиенты</h1>

  <p v-if="loading">Загрузка...</p>
  <p v-else-if="error">Ошибка: {{ error }}</p>
  <p v-else-if="clients.length === 0">Клиентов пока нет</p>
  <ul v-else>
    <li v-for="client in clients" :key="client.id">{{ client.name }} (ИНН {{ client.inn }})</li>
  </ul>
</template>
