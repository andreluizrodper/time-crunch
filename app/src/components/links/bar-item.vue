<template>
  <div class="relative group">
    <a :href="url" target="_blank">
      <Badge>
        {{ link.data().name }}
      </Badge>
    </a>
    <Button
      size="xs"
      @click="doArchiveLink"
      variant="ghost"
      class="absolute rounded-full -top-1 -right-1 hidden group-hover:block"
    >
      <X size="12" />
    </Button>
  </div>
</template>

<script>
import { Badge } from "@/components/ui/badge";
import { archiveLink } from "@/utils/links";
import { X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

export default {
  props: {
    link: Object,
  },
  components: {
    Badge,
    X,
    Button,
  },
  computed: {
    url() {
      let url = this.link.data().url;
      if (!url.startsWith("http")) {
        url = `https://${url}`;
      }
      return url;
    },
  },
  methods: {
    async doArchiveLink() {
      await archiveLink({ id: this.link.id });
    },
  },
};
</script>
