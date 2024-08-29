<template>
  <Sheet :open="projectSheet.status" @update:open="toggleOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{{ title }}</SheetTitle>
        <SheetDescription>
          <form @submit.prevent="submit" class="space-y-4 mt-4">
            <Input
              type="text"
              v-model="name"
              placeholder="Project name"
              class="input"
            />
            <div class="flex gap-4">
              <SheetClose as-child>
                <Button variant="ghost">Close</Button>
              </SheetClose>
              <Button type="submit" class="w-full">
                {{ buttonText }}
              </Button>
            </div>
          </form>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>

<script>
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createProject, updateProject } from "@/utils/projects";

export default {
  components: {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Button,
    Input,
    SheetClose,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    projectSheet() {
      return this.$store.state.projectSheet;
    },
    title() {
      return this.projectSheet.id ? "Edit project" : "New project";
    },
    buttonText() {
      return this.projectSheet.id ? "Save" : "Create";
    },
  },
  watch: {
    projectSheet() {
      if (this.projectSheet.id) {
        this.getData();
      }
    },
  },
  data() {
    return {
      name: "",
    };
  },
  methods: {
    async getData() {
      const project = await getProject(this.projectSheet.id);
      this.name = project.data().name;
    },
    toggleOpen() {
      this.$store.commit("setProjectSheet", { status: false });
    },
    async submit() {
      if (this.projectSheet.id) {
        await updateProject({
          id: this.projectSheet.id,
          data: {
            name: this.name,
          },
        });
      } else {
        const create = await createProject({
          data: {
            name: this.name,
          },
        });
        this.$router.push({ name: "list", params: { id: create.id } });
      }
      this.name = "";
      this.toggleOpen();
    },
  },
};
</script>
