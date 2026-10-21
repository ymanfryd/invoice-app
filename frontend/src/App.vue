<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav class="nav">
    <RouterLink class="nav__link" to="/clients">Клиенты</RouterLink>
    <RouterLink class="nav__link" to="/invoices">Счета</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped lang="scss">
.nav {
  display: flex;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;

  &__link {
    color: #6b7280;
    text-decoration: none;

    &.router-link-active {
      color: #2563eb;
      font-weight: 600;
    }
  }
}
</style>
