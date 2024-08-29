<template>
  <Sheet :open="sprintSheet.status" @update:open="toggleOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{{ title }}</SheetTitle>
        <SheetDescription>
          <form @submit.prevent="submit" class="space-y-4 mt-4">
            <Input
              type="text"
              v-model="name"
              placeholder="Nome do sprint."
              class="input"
              required
            />
            <div class="flex gap-4">
              <SheetClose as-child>
                <Button variant="ghost">Close</Button>
              </SheetClose>
              <Button
                type="submit"
                class="w-full disable:opacity-40"
                :disabed="!isValid"
              >
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
import { getSprint, createSprint, updateSprint } from "@/utils/sprints";

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
    isValid() {
      return this.name.length > 3;
    },
    account() {
      return this.$store.state.account;
    },
    sprintSheet() {
      return this.$store.state.sprintSheet;
    },
    title() {
      return this.sprintSheet.id ? "Edit sprint" : "New sprint";
    },
    buttonText() {
      return this.sprintSheet.id ? "Save" : "Create";
    },
  },
  watch: {
    sprintSheet() {
      if (this.sprintSheet.id) {
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
      const sprint = await getSprint(this.sprintSheet.id);
      this.name = sprint.data().name;
    },
    toggleOpen() {
      this.$store.commit("setSprintSheet", { status: false });
    },
    async submit() {
      if (this.sprintSheet.id) {
        await updateSprint({
          id: this.sprintSheet.id,
          data: {
            name: this.name,
          },
        }).then(() => {
          this.$store.commit("addToast", {
            description: `Sprint ${this.name} atualizado!`,
          });
        });
      } else {
        await createSprint({
          data: {
            name: this.name,
            project_id: this.sprintSheet.project_id,
          },
        }).then((sprint) => {
          this.$store.commit("addToast", {
            description: `Sprint ${this.name} criada!`,
          });
          this.$store.commit("setRedirect", this.$route.name);
          this.$router.push({
            name: "sprint",
            params: {
              sprint_id: sprint.id,
              project_id: this.sprintSheet.project_id,
            },
          });
        });
      }
      this.name = "";
      this.description = "";
      this.tags = [];
      this.toggleOpen();
    },
  },
};
</script>
