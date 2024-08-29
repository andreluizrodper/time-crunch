<template>
  <Popover>
    <PopoverTrigger>
      <Badge variant="outline" class="rounded-full text-xs border">
        {{ pointsTmp }}
      </Badge>
    </PopoverTrigger>
    <PopoverContent>
      <div class="flex justify-between items-center gap-2">
        <p>Pontos da tarefa</p>
        <Input
          type="number"
          v-model="pointsTmp"
          class="input w-20"
          @blur="saveTask"
        />
      </div>
    </PopoverContent>
  </Popover>
</template>

<script>
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { updateTask } from "@/utils/tasks";
import { Badge } from "@/components/ui/badge";

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  components: {
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Badge,
  },
  emits: ["update"],
  data() {
    return {
      pointsTmp: this.task.data().points ?? 0,
    };
  },
  methods: {
    saveTask() {
      updateTask({
        id: this.task.id,
        data: {
          points: this.pointsTmp,
        },
      }).then(() => {
        this.$emit("update");
      });
    },
  },
};
</script>
