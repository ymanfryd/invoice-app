<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { fetchInvoices, type Invoice } from '@/api/invoices'

const PAGE_SIZE = 3

const invoices = ref<Invoice[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const page = ref(1)

const hasNext = ref(false)

async function load() {
  loading.value = true
  error.value = null
  try {
    const rows = await fetchInvoices(PAGE_SIZE + 1, (page.value - 1) * PAGE_SIZE)
    hasNext.value = rows.length > PAGE_SIZE
    invoices.value = rows.slice(0, PAGE_SIZE)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Unknown error'
  } finally {
    loading.value = false
  }
}

watch(page, load, { immediate: true })
</script>

<template>
  <h1 class="invoices__title">Счета</h1>

  <p v-if="loading" class="invoices__status">Загрузка...</p>
  <p v-else-if="error" class="invoices__status invoices__status--error">Ошибка: {{ error }}</p>
  <p v-else-if="invoices.length === 0" class="invoices__status">Счетов пока нет</p>
  <ul v-else class="invoices__list">
    <li v-for="invoice in invoices" :key="invoice.id" class="invoices__item">
      <span class="invoices__number">{{ invoice.number }}</span>
      <span class="invoices__date">{{ invoice.issued_at ?? 'не выставлен' }}</span>
      <span class="invoices__badge" :class="`invoices__badge--${invoice.status}`">
        {{ invoice.status }}
      </span>
    </li>
  </ul>

  <div class="invoices__pager">
    <button :disabled="page === 1 || loading" @click="page--">Назад</button>
    <span>Страница {{ page }}</span>
    <button :disabled="!hasNext || loading" @click="page++">Вперёд</button>
  </div>
</template>

<style scoped lang="scss">
.invoices {
  &__title {
    margin: 24px 0 16px;
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
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid #e5e7eb;
  }

  &__number {
    font-weight: 600;
  }

  &__date {
    flex: 1;
    color: #6b7280;
  }

  &__badge {
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 12px;
    background: #e5e7eb;

    &--issued {
      background: #dbeafe;
      color: #1d4ed8;
    }

    &--paid {
      background: #dcfce7;
      color: #15803d;
    }
  }

  &__pager {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 16px;
  }
}
</style>
