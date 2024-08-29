<template>
  <div
    class="px-4 bg-purple-50 dark:bg-purple-950 py-2 w-full justify-between flex items-center"
  >
    <div>
      <Logo />
    </div>
    <div class="flex items-center gap-4">
      <Notifications v-if="account" />
      <UserMenu />
    </div>
  </div>
</template>

<script>
import Notifications from "@/components/dashboard/ui/notifications.vue";
import UserMenu from "@/components/dashboard/ui/user-menu.vue";
import Logo from "@/components/ui/logo.vue";

export default {
  components: {
    Notifications,
    UserMenu,
    Logo,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
};
</script>
