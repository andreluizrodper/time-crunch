<template>
  <Button :size="size" variant="outline" @click="toggleSprintStatus">
    <Play v-if="!sprint.data().is_active" size="16" />
    <Square v-if="sprint.data().is_active" size="16" />
  </Button>
</template>

<script>
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-vue-next";
import { updateSprint, sprintStatuses } from "@/utils/sprints";

export default {
  props: {
    size: {
      type: String,
      default: "sm",
    },
    sprint: {
      type: Object,
      required: true,
    },
  },
  components: {
    Button,
    Play,
    Square,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
  methods: {
    async toggleSprintStatus() {
      const time_intervals = this.sprint.data().time_intervals ?? [];
      let time_spent = this.sprint.data().time_spent ?? 0;
      if (this.sprint.data().is_active) {
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
      updateSprint({
        id: this.sprint.id,
        data: {
          status: sprintStatuses[1],
          project_id: this.sprint.data().project_id,
          is_active: !this.sprint.data().is_active,
          time_intervals,
          time_spent,
        },
      }).then(() => {
        this.$emit("update");
      });
    },
  },
};
</script>
