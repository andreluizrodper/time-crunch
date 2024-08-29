<template>
  <div v-if="loading">
    <div class="flex py-6 justify-center">
      <Loading />
    </div>
  </div>
  <div v-if="!loading" class="space-y-4">
    <Breadcrumbs
      :items="[
        { icon: 'LayoutGrid', link: { name: 'dashboard' } },
        { text: 'Projects' },
        {
          text: project.data().name,
          link: { name: 'overview', params: { id: project.id } },
        },
      ]"
    />
    <div
      class="flex sticky top-0 bg-background py-1 z-10 justify-between items-center"
    >
      <CardTitle class="flex items-center gap-2">
        {{ project.data().name }}
        <Badge variant="muted" v-if="project.data().archived">Arquivado</Badge>
      </CardTitle>
      <div class="flex items-center gap-2">
        <span v-if="spent" class="flex gap-2 items-center text-sm">
          <Clock size="16" />
          {{ spent }}
        </span>
        <AccountAvatar v-if="project.data().owner" :id="project.data().owner" />
        <Menu :project="project" @getData="getData" />
      </div>
    </div>
    <LinksBar :hasAddButton="!project.data().archived" />
    <RouterView :project="project" />
  </div>
</template>

<script>
import Breadcrumbs from "@/components/dashboard/ui/breadcrumbs.vue";
import { getProject } from "@/utils/projects";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RouterView } from "vue-router";
import { Home, Clock } from "lucide-vue-next";
import LinksBar from "@/components/links/bar.vue";
import AccountAvatar from "@/components/ui/account-avatar.vue";
import Menu from "@/components/projects/overview/menu.vue";
import { Badge } from "@/components/ui/badge";
import { getProjectTimeSpent } from "@/utils/tasks";
import Loading from "@/components/ui/loading.vue";

export default {
  components: {
    Breadcrumbs,
    Card,
    Home,
    Clock,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    LinksBar,
    RouterView,
    AccountAvatar,
    Menu,
    Badge,
    Loading,
  },
  emits: ["getData"],
  data() {
    return {
      loading: true,
      project: {},
      spent: null,
    };
  },
  async mounted() {
    await this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      this.project = await getProject({ id: this.$route.params.id });

      this.spent = await getProjectTimeSpent({
        project_id: this.$route.params.id,
      });
      this.loading = false;
    },
  },
};
</script>
