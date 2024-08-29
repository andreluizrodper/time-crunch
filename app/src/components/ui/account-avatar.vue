<template>
  <div :class="`flex justify-between gap-2 ${className}`">
    <div class="flex items-center gap-2 justify-start">
      <Avatar class="flex items-center justify-center">
        <AvatarFallback>
          <LoaderCircle v-if="!account" class="size-4 animate-spin" />
          {{ initials }}
        </AvatarFallback>
      </Avatar>
      <div
        v-if="showName && account"
        class="flex flex-col justify-center items-start"
      >
        {{ account.data().name }}
        <span class="text-xs">{{ account.data().email }}</span>
      </div>
    </div>
    <slot :account="account" />
  </div>
</template>

<script>
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LoaderCircle } from "lucide-vue-next";
import { getAccount } from "@/utils/account";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    showName: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      required: false,
    },
  },
  components: {
    Avatar,
    AvatarFallback,
    LoaderCircle,
  },
  computed: {
    initials() {
      if (!this.account || !this.account.data().name) return "";
      const parts = this.account.data().name.split(" ");
      if (parts.length === 1) return parts[0].charAt(0);

      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    },
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      account: null,
    };
  },
  methods: {
    async getData() {
      this.account = await getAccount({ id: this.id, setStore: false });
    },
  },
};
</script>
