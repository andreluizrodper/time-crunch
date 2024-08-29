<template>
  <Button @click="toggleSprint" size="sm" variant="outline" class="flex gap-2">
    <Plus size="16" /> Sprint
  </Button>
</template>

<script>
import { Plus } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

export default {
  components: {
    Plus,
    Button,
  },
  methods: {
    toggleSprint() {
      this.$store.commit("setSprintSheet", {
        status: true,
        project_id: this.$route.params.id,
      });
    },
  },
};
</script>
