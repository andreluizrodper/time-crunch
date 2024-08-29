<template>
  <Card class="w-full border-0 border-y rounded-none sm:border sm:rounded">
    <CardHeader class="py-3 px-0 sm:p-6">
      <CardTitle> Projects </CardTitle>
    </CardHeader>
    <CardContent class="py-3 px-0 sm:p-6 sm:pt-0">
      <Skeleton class="w-full h-[58px]" v-if="loading" />
      <p class="text-xl" v-if="!loading && projects.length === 0">
        Você ainda não tem um projeto
      </p>
      <div v-else class="grid gap-4 lg:grid-cols-4">
        <ProjectItem
          v-for="project in projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </CardContent>
    <CardFooter class="flex justify-end py-3 px-0 sm:p-6 sm:pt-0">
      <Button variant="ghost" @click="toggleForm">Começar novo projeto</Button>
    </CardFooter>
  </Card>
</template>

<script>
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProjects } from "@/utils/projects";
import ProjectItem from "./project-item.vue";
import { Skeleton } from "@/components/ui/skeleton";

export default {
  components: {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardFooter,
    Button,
    ProjectItem,
    Skeleton,
  },
  data() {
    return {
      loading: true,
      projects: [],
    };
  },
  async mounted() {
    this.projects = await getProjects();
    this.loading = false;
  },
  methods: {
    toggleForm() {
      this.$store.commit("setProjectSheet", { status: true, id: null });
    },
  },
};
</script>
