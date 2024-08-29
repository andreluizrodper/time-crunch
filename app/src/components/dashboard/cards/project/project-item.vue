<template>
  <router-link
    :to="{ name: 'list', params: { id: project.id } }"
    class="border rounded flex items-center py-2 px-4 hover:bg-muted"
  >
    <div class="flex flex-col gap-2 w-full">
      <span class="w-full text-base">
        {{ project.data().name }}
      </span>
      <div class="flex gap-2">
        <div class="border px-2 py-1 rounded flex gap-2 items-center">
          <Skeleton v-if="countTasks === null" class="w-6 h-6" />
          <span v-else>
            {{ countTasks }}
          </span>
          <TicketCheck :size="16" />
        </div>
        <div class="border px-2 py-1 rounded flex gap-2 items-center">
          {{ project.data().shared_with.length }}
          <Users :size="16" />
        </div>
      </div>
      <div class="text-xs">{{ dateFormated }}</div>
    </div>
    <ArrowRight />
  </router-link>
</template>

<script>
import { Button } from "@/components/ui/button";
import { ArrowRight, TicketCheck, Users } from "lucide-vue-next";
import { countTasks } from "@/utils/tasks";
import { Skeleton } from "@/components/ui/skeleton";
import { DateTime } from "luxon";

export default {
  components: {
    Button,
    ArrowRight,
    Skeleton,
    TicketCheck,
    Users,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      countTasks: null,
    };
  },
  computed: {
    dateFormated() {
      const createdAtFormated =
        DateTime.fromJSDate(
          this.project.data().created_at?.toDate()
        ).toRelative() ?? null;
      const updatedAtFormated = DateTime.fromJSDate(
        this.project.data().updated_at?.toDate()
      ).toRelative();
      if (createdAtFormated && updatedAtFormated !== createdAtFormated)
        return `${updatedAtFormated} - ${createdAtFormated}`;
      return `${updatedAtFormated}`;
    },
  },
  async mounted() {
    this.countTasks = await countTasks({ project_id: this.project.id });
  },
};
</script>
