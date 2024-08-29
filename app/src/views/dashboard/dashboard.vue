<template>
  <TopBar />
  <div v-if="account" class="flex flex-col gap-4 py-4">
    <div class="flex flex-col gap-4 w-full">
      <DayOrganizer />
      <Projects />
    </div>
  </div>
</template>

<script>
import TopBar from "@/components/dashboard/ui/top-bar.vue";
import Projects from "@/components/dashboard/cards/project/projects.vue";
import DayOrganizer from "@/components/dashboard/cards/day/day.vue";

export default {
  components: {
    TopBar,
    Projects,
    DayOrganizer,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
};
</script>
