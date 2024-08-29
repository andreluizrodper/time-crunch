<template>
  <div class="ml-2 py-2 pl-4 border-l border-l-slate-400">
    <div class="text-xl font-bold relative">
      <div
        class="border-t-2 border-t-slate-400 absolute top-3 -left-4 w-[10px]"
      ></div>
      {{ interval.account.name }}
    </div>
    <p class="text-sm">
      de {{ formattedStartDate }}
      até
      {{ formattedEndDate }}
      tempo gasto
      {{ formattedTimeSpent }}
    </p>
  </div>
</template>

<script>
import { DateTime } from "luxon";
import { formatTimeSpent } from "@/utils/tasks";
export default {
  props: {
    interval: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedTimeSpent() {
      return formatTimeSpent(
        this.interval.end?.toDate() - this.interval.start.toDate()
      );
    },
    formattedStartDate() {
      return DateTime.fromJSDate(this.interval.start.toDate()).toFormat(
        "dd/MM/yyyy HH:mm"
      );
    },
    formattedEndDate() {
      if (!this.interval.end) return "-";
      return DateTime.fromJSDate(this.interval.end.toDate()).toFormat(
        "dd/MM/yyyy HH:mm"
      );
    },
  },
};
</script>
