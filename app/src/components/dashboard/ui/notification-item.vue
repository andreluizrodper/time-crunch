<template>
  <DropdownMenuItem :class="`w-80 ${isUnread && 'bg-border w-full'}`">
    <div class="flex gap-4 items-center">
      <Avatar class="flex items-center justify-center">
        <AvatarFallback>
          {{ initials }}
        </AvatarFallback>
      </Avatar>
      <div class="flex flex-col gap-1">
        <div class="text-base">{{ notification.data().account.name }}</div>
        <div class="text-sm">{{ notification.data().message }}</div>
        <span class="text-xs text-gray-500">{{ date }}</span>
      </div>
    </div>
  </DropdownMenuItem>
</template>

<script>
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DateTime } from "luxon";
import { markNotificationAsRead } from "@/utils/notifications";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    date() {
      return DateTime.fromJSDate(
        this.notification.data().created_at.toDate()
      ).toRelative();
    },
    initials() {
      if (!this.notification.data().account) return "";
      const parts = this.notification.data().account.name.split(" ");
      if (parts.length === 1) return parts[0].charAt(0);

      return parts[0].charAt(0) + parts[parts.length - 1].charAt(0);
    },
    isUnread() {
      return !this.notification.data().read_by.includes(this.account.id);
    },
  },
  components: {
    Avatar,
    DropdownMenuItem,
    AvatarFallback,
  },
  mounted() {
    if (!this.notification.data().read_by.includes(this.account.id)) {
      markNotificationAsRead({ id: this.notification.id });
    }
  },
};
</script>
