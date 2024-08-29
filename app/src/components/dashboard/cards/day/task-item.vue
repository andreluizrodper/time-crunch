<template>
  <Card v-if="task" class="relative">
    <CardContent
      class="px-2 sm:px-6 flex flex-col sm:flex-row gap-2 sm:items-center py-2"
    >
      <p class="flex-1">
        <Button variant="link" as-child class="p-0">
          <router-link
            class="font-semibold group flex items-center gap-2"
            :to="{
              name: 'task-dialog',
              params: { task_id: task.id },
            }"
          >
            <span class="uppercase">{{ task.data().code }}</span> -
            {{ task.data().name }}
            <ExternalLink size="12" class="hidden group-hover:inline-block" />
          </router-link>
        </Button>
      </p>
      <div class="flex gap-2">
        <BadgeStatusTask :task="task" @update="getData" />
        <AccountAvatar
          :id="task.data().assigned_to ?? task.data().created_by"
        />
        <PlayButton size="md" :task="task" />
      </div>
    </CardContent>
    <span
      v-if="task.data().is_active"
      class="absolute bottom-0 bg-green-400 w-[20%] block h-1 animate-progress"
    ></span>
  </Card>
</template>

<script>
import { Card, CardContent } from "@/components/ui/card";
import AccountAvatar from "@/components/ui/account-avatar.vue";
import TaskListItemMenu from "@/components/projects/overview/list-item-menu.vue";
import BadgeStatusTask from "@/components/tasks/status-badge.vue";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-vue-next";
import { getTask } from "@/utils/tasks";
import PlayButton from "@/components/tasks/play-button.vue";

export default {
  props: {
    task_id: {
      type: String,
      required: true,
    },
  },
  components: {
    Card,
    CardContent,
    AccountAvatar,
    TaskListItemMenu,
    BadgeStatusTask,
    Button,
    ExternalLink,
    PlayButton,
  },
  data() {
    return {
      task: null,
    };
  },
  async mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.task = await getTask({ id: this.task_id });
    },
  },
};
</script>
