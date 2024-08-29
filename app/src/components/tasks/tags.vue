<template>
  <TagsInput
    v-model="tags"
    :addOnBlur="true"
    :addOnPaste="true"
    @update:modelValue="update"
    class="border-0"
  >
    <TagsInputItem v-for="item in tags" :key="item" :value="item">
      <TagsInputItemText />
      <TagsInputItemDelete />
    </TagsInputItem>

    <TagsInputInput placeholder="Adicionar Tags" />
  </TagsInput>
</template>

<script>
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";
import { updateTask } from "@/utils/tasks";

export default {
  components: {
    TagsInput,
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
  },
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tags: null,
    };
  },
  mounted() {
    this.tags = this.task.data().tags || [];
  },
  methods: {
    update() {
      const tagsParsed = this.tags.map((tag) => tag.toLowerCase());
      updateTask({
        id: this.task.id,
        data: { tags: this.tags, tagsParsed },
      });
    },
  },
};
</script>
