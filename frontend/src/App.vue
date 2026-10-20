<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <nav>
    <RouterLink to="/clients">Клиенты</RouterLink>
    <RouterLink to="/invoices">Счета</RouterLink>
  </nav>
  <RouterView />
</template>
