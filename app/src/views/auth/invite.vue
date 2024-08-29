<template>
  <div class="space-y-1 text-center">
    <h1 class="text-2xl font-semibold tracking-tight">Criar a sua conta</h1>
    <p class="text-gray-500 text-sm">
      Você foi convidado para participar de um projeto!<br />
      Precisamos do seu nome e a sua senha para você começar
    </p>
  </div>
  <UserAuthForm />
</template>

<script setup>
import UserAuthForm from "@/components/auth/invite.vue";
</script>
