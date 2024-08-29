<template>
  <Button @click="toggleTask" size="sm" variant="outline" class="flex gap-2">
    <Plus size="16" /> Tarefa
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
    toggleTask() {
      this.$store.commit("setTaskSheet", {
        status: true,
        project_id: this.$route.params.id,
      });
    },
  },
};
</script>
