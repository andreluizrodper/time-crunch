<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button size="sm" variant="outline" class="relative">
        <Bell size="14" />
        <Badge
          v-if="count > 0"
          variant="destructive"
          class="ml-1 absolute -top-1 -right-4"
        >
          {{ count > 9 ? "9+" : count }}
        </Badge>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <div class="max-h-[320px] overflow-y-auto">
        <NotificationItem
          v-for="notification in notifications"
          :key="notification.id"
          :notification="notification"
        />
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script>
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { getNotifications } from "@/utils/notifications";
import NotificationItem from "./notification-item.vue";

export default {
  components: {
    Badge,
    Bell,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    Button,
    NotificationItem,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
  data() {
    return {
      count: 0,
      notifications: [],
    };
  },
  async mounted() {
    this.notifications = await getNotifications();
    const filtered = this.notifications.filter(
      (notification) => !notification.data().read_by.includes(this.account.id)
    );
    this.count = filtered.length;
  },
};
</script>
