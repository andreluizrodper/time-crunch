<template>
  <div class="flex gap-2">
    <BarItem v-for="link in links" :key="link.id" :link="link" />
    <Button
      v-if="hasAddButton"
      size="xs"
      variant="outline"
      @click="toggleLinkForm"
      class="flex gap-1"
    >
      <Plus size="18" /> link
    </Button>
  </div>
</template>

<script>
import { Badge } from "@/components/ui/badge";
import { getLinks } from "@/utils/links";
import { Plus } from "lucide-vue-next";
import BarItem from "@/components/links/bar-item.vue";
import { Button } from "@/components/ui/button";

export default {
  props: {
    hasAddButton: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Badge,
    BarItem,
    Plus,
    Button,
  },
  computed: {
    doUpdate() {
      return this.$store.state.update;
    },
  },
  watch: {
    doUpdate() {
      if (this.doUpdate.includes("links")) {
        this.$store.commit(
          "setUpdate",
          this.doUpdate.filter((item) => item !== "links")
        );
        this.getData();
      }
    },
  },
  data() {
    return {
      links: [],
    };
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    async getData() {
      this.links = await getLinks({ project_id: this.$route.params.id });
    },
    toggleLinkForm() {
      this.$store.commit("setLinkSheet", {
        status: true,
        project_id: this.$route.params.id,
      });
    },
  },
};
</script>
