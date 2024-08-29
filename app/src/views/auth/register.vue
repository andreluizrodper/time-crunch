<template>
  <div class="space-y-1 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">Criar a sua conta</h1>
    <p class="text-gray-500">
      Crie a sua conta abaixo para começar a usar o vê a conta!
    </p>
  </div>
  <UserAuthForm />
</template>

<script setup>
import UserAuthForm from "@/components/auth/create-account.vue";
</script>
