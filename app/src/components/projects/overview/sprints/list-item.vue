<template>
  <Card>
    <CardContent class="px-2 sm:px-6 flex gap-2 items-center py-4">
      <div class="flex flex-col sm:flex-row sm:items-center w-full">
        <div class="flex justify-between items-center w-full">
          <div class="flex-1 gap-2 flex justify-center flex-col items-start">
            <div class="flex gap-4">
              <PlayButton :sprint="sprint" @update="update" />
              <Button
                variant="link"
                @click="toggleSprintDialog"
                class="p-0 font-semibold group flex items-center gap-2"
              >
                {{ sprint.data().name }}
                <ExternalLink
                  size="12"
                  class="hidden group-hover:inline-block"
                />
              </Button>
            </div>
            <div class="flex gap-4">
              <div
                v-if="sprint.data().selected"
                class="flex gap-2 items-center text-sm"
              >
                <TicketCheck size="16" />
                {{ sprint.data().selected.length ?? "" }}
              </div>
              <div
                v-if="countInprogress > 0"
                class="flex gap-2 items-center text-sm"
              >
                <Settings size="16" class="animate-slow-spin" />
                {{ countInprogress }}
              </div>
              <div
                v-if="countCompleted > 0"
                class="flex gap-2 items-center text-sm"
              >
                <CheckCheck size="16" />
                {{ countCompleted }}
              </div>
              <div v-if="sumPoints > 0" class="flex gap-2 items-center text-sm">
                <Sigma size="16" />
                {{ sumPoints }}
              </div>
            </div>
          </div>
          <ListItemMenu :sprint="sprint" @update="update" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script>
import { Card, CardContent } from "@/components/ui/card";
import AccountAvatar from "@/components/ui/account-avatar.vue";
import ListItemMenu from "@/components/projects/overview/sprints/list-item-menu.vue";
import BadgeStatusTask from "@/components/tasks/status-badge.vue";
import { Button } from "@/components/ui/button";
import {
  CheckCheck,
  ExternalLink,
  TicketCheck,
  Settings,
  Sigma,
} from "lucide-vue-next";
import { getTask } from "@/utils/tasks";
import PlayButton from "@/components/sprint/play-button.vue";

export default {
  props: {
    sprint: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tasks: [],
    };
  },
  components: {
    Settings,
    Card,
    CardContent,
    AccountAvatar,
    ListItemMenu,
    BadgeStatusTask,
    Button,
    ExternalLink,
    PlayButton,
    TicketCheck,
    CheckCheck,
    Sigma,
  },
  computed: {
    countCompleted() {
      return this.tasks.reduce((acc, task) => {
        if (task.data().status.name === "completed") acc++;
        return acc;
      }, 0);
    },
    countInprogress() {
      return this.tasks.reduce((acc, task) => {
        if (!["completed", "backlog"].includes(task.data().status.name)) acc++;
        return acc;
      }, 0);
    },
    sumPoints() {
      return this.tasks.reduce((acc, task) => {
        acc += parseInt(task.data().points ?? 0);
        return acc;
      }, 0);
    },
  },
  async mounted() {
    if (this.sprint.data().selected) {
      for (const id of this.sprint.data().selected) {
        getTask({ id }).then((task) => this.tasks.push(task));
      }
    }
  },
  emits: ["update"],
  methods: {
    toggleSprintDialog() {
      this.$store.commit("setRedirect", this.$route.name);
      this.$router.push({
        name: "sprint",
        params: { sprint_id: this.sprint.id },
      });
    },
    update() {
      this.$emit("update");
    },
  },
};
</script>
