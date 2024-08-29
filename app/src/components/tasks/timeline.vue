<template>
  <div v-if="this.task.data().time_intervals" class="flex gap-1">
    <div
      v-for="(interval, index) in getIntervalsByUser"
      :key="index"
      class="flex"
      :style="{
        width: `${(interval.time_spent / task.data().time_spent) * 100}%`,
      }"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <div :class="`py-2 w-full`">
              <div :class="`h-1 ${colors[index % colors.length]}`"></div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {{ interval.name }}
              {{ formattedTimeSpent(interval.time_spent) }}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
  <div v-else class="h-1 py-2"></div>
</template>

<script>
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTimeSpent } from "@/utils/tasks";

export default {
  components: {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  },
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      colors: ["bg-red-200", "bg-blue-200", "bg-green-200", "bg-yellow-200"],
    };
  },
  computed: {
    getIntervalsByUser() {
      if (!this.task.data().time_intervals) return;
      return this.task.data().time_intervals.reduce((acc, interval) => {
        if (!interval.end) return acc;
        const index = acc.findIndex(
          (i) => i.account?.name === interval.account?.name
        );
        if (index < 0) {
          acc.push({
            name: interval.account.name,
            time_spent: interval.end.toDate() - interval.start.toDate(),
          });
        } else {
          acc[index].time_spent +=
            interval.end.toDate() - interval.start.toDate();
        }
        return acc;
      }, []);
    },
  },
  methods: {
    formattedTimeSpent(time) {
      return formatTimeSpent(time);
    },
  },
};
</script>
