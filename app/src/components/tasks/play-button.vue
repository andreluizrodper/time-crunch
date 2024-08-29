<template>
  <Button :size="size" variant="outline" @click="toggleTaskStatus">
    <Play v-if="!isActiveTmp" size="16" />
    <Pause v-if="isActiveTmp" size="16" />
  </Button>
</template>

<script>
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-vue-next";
import { updateTask, getTask } from "@/utils/tasks";

export default {
  props: {
    size: {
      type: String,
      default: "sm",
    },
    task: {
      type: Object,
      required: true,
    },
  },
  components: {
    Button,
    Play,
    Pause,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
  data() {
    return {
      isActiveTmp: this.task.data().is_active,
    };
  },
  methods: {
    async toggleTaskStatus() {
      const taskData = await getTask({ id: this.task.id });
      const time_intervals = taskData.data().time_intervals ?? [];
      let time_spent = taskData.data().time_spent ?? 0;
      if (this.isActiveTmp) {
        const last = time_intervals.length - 1;
        const end = new Date();
        const start = time_intervals[last].start.toDate();
        time_intervals[last].end = end;
        time_spent += end - start;
      } else {
        time_intervals.push({
          account: this.account.data(),
          start: new Date(),
        });
      }
      this.isActiveTmp = !this.isActiveTmp;
      updateTask({
        id: this.task.id,
        data: {
          is_active: this.isActiveTmp,
          time_intervals,
          time_spent,
        },
      });
    },
  },
};
</script>
