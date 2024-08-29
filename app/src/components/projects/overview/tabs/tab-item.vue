<template>
  <router-link
    :to="item.to"
    :class="`px-3 py-2 text-xs border rounded hover:bg-muted ${item.class}`"
    :active-class="`bg-muted`"
  >
    <span v-if="item.text">{{ item.text }}</span>
    <Icon v-if="item.icon" :name="item.icon" :size="16" />
  </router-link>
</template>

<script>
import Icon from "@/components/ui/icon.vue";
export default {
  components: {
    Icon,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
