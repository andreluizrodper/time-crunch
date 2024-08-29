<template>
  <Card class="w-full border-0 border-y rounded-none sm:border sm:rounded">
    <CardHeader class="py-3 px-0 sm:p-6">
      <div class="flex justify-between items-center">
        <CardTitle> Your day </CardTitle>
        <TaskSearch @getdata="getData" :todayPick="todayPick" />
      </div>
    </CardHeader>
    <CardContent class="py-3 px-0 sm:p-6 sm:pt-0 space-y-2">
      <TaskListItem
        v-for="task_id in todayPick?.data().task_ids"
        :key="task_id"
        :task_id="task_id"
      />
    </CardContent>
    <TaskDialog
      :redirect="{ name: 'dashboard' }"
      v-if="$route.params.task_id"
    />
  </Card>
</template>

<script>
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDayPicks } from "@/utils/day-picks";
import { Skeleton } from "@/components/ui/skeleton";
import TaskSearch from "./task-search.vue";
import { DateTime } from "luxon";
import TaskListItem from "./task-item.vue";
import TaskDialog from "@/components/tasks/dialog.vue";

export default {
  components: {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardFooter,
    Button,
    Skeleton,
    TaskSearch,
    TaskListItem,
    TaskDialog,
  },
  data() {
    return {
      loading: true,
      picks: [],
    };
  },
  computed: {
    todayPick() {
      const now = DateTime.now();
      return this.picks.find((pick) =>
        DateTime.fromJSDate(pick.data().created_at.toDate()).hasSame(now, "day")
      );
    },
  },
  async mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      this.picks = await getDayPicks();
    },
  },
};
</script>
