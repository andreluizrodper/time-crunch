<template>
  <Card>
    <CardContent class="py-2 px-4 flex gap-2 items-center">
      <PlayButton size="xs" :task="task" @update="update" />
      <Button variant="link" as-child class="p-0">
        <router-link
          class="font-semibold group flex items-center gap-2"
          :to="{ name: 'task', params: { task_id: task.id } }"
        >
          {{ task.data().name }}
          <ExternalLink size="12" class="hidden group-hover:inline-block" />
        </router-link>
      </Button>
    </CardContent>
  </Card>
</template>

<script>
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-vue-next";
import PlayButton from "@/components/tasks/play-button.vue";

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  components: {
    Card,
    CardContent,
    Button,
    ExternalLink,
    PlayButton,
  },
  methods: {
    update() {
      this.$emit("update");
    },
  },
};
</script>
