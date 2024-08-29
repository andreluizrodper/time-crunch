<template>
  <Card :class="`${isExpanded ? '' : 'rounded-none border-b-0'}`">
    <CardContent
      :class="`px-2 sm:px-6 flex gap-2 items-center ${
        isExpanded ? 'py-4' : 'py-1'
      }`"
    >
      <div class="flex flex-col sm:flex-row sm:items-center w-full">
        <div class="flex-1 gap-2 flex items-center">
          <PlayButton v-if="showPlay" size="xs" @update="update" :task="task" />
          <Button
            variant="link"
            @click="toggleTaskDialog"
            class="p-0 font-semibold group flex items-center gap-2"
          >
            {{ task.data().name }}
            <ExternalLink size="12" class="hidden group-hover:inline-block" />
          </Button>
          <span
            class="flex gap-2 items-center text-xs"
            v-if="showTimeSpent && task.data().time_spent"
          >
            <Clock size="16" />
            {{ timeSpentFormated }}
          </span>
        </div>
        <div class="flex gap-2">
          <SelectSprint :task="task" @update="update" />
          <TaskPointsPopOver @update="update" :task="task" />
          <BadgeStatusTask @update="update" :task="task" />
          <AccountAvatar
            :id="task.data().assigned_to ?? task.data().created_by"
          />
        </div>
      </div>
      <TaskListItemMenu @update="update" :task="task" />
    </CardContent>
  </Card>
</template>

<script>
import { Card, CardContent } from "@/components/ui/card";
import AccountAvatar from "@/components/ui/account-avatar.vue";
import TaskListItemMenu from "@/components/projects/overview/list-item-menu.vue";
import BadgeStatusTask from "@/components/tasks/status-badge.vue";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock } from "lucide-vue-next";
import PlayButton from "@/components/tasks/play-button.vue";
import TaskPointsPopOver from "@/components/tasks/points-pop-over.vue";
import SelectSprint from "@/components/sprint/select-sprint.vue";

export default {
  props: {
    showTimeSpent: {
      type: Boolean,
      default: false,
    },
    showPlay: {
      type: Boolean,
      default: true,
    },
    task: {
      type: Object,
      required: true,
    },
    isExpanded: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Card,
    SelectSprint,
    TaskPointsPopOver,
    CardContent,
    AccountAvatar,
    TaskListItemMenu,
    BadgeStatusTask,
    Button,
    ExternalLink,
    PlayButton,
    Clock,
  },
  computed: {
    timeSpentFormated() {
      const timeSpentMillis = this.task.data().time_spent;
      const timeSpentSeconds = timeSpentMillis / 1000;
      const minutes = Math.floor((timeSpentSeconds % 3600) / 60);
      const hours = Math.floor(timeSpentSeconds / 3600);
      const days = Math.floor(hours / 24);
      return `${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${
        minutes ? `${minutes}m` : ""
      }`;
    },
  },
  methods: {
    toggleTaskDialog() {
      this.$store.commit("setRedirect", this.$route.name);
      this.$router.push({ name: "task", params: { task_id: this.task.id } });
    },
    update() {
      this.$emit("update");
    },
  },
};
</script>
