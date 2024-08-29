<template>
  <Sheet :open="taskSheet.status" @update:open="toggleOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{{ title }}</SheetTitle>
        <SheetDescription>
          <form @submit.prevent="submit" class="space-y-4 mt-4">
            <Input
              type="text"
              v-model="name"
              placeholder="Nome da tarefa."
              class="input"
              required
            />
            <div class="flex justify-between items-center">
              <Label>Pontuação tarefa</Label>
              <Input type="number" v-model="points" class="input w-20" />
            </div>
            <TagsInput v-model="tags">
              <TagsInputItem v-for="item in tags" :key="item" :value="item">
                <TagsInputItemText />
                <TagsInputItemDelete />
              </TagsInputItem>

              <TagsInputInput
                placeholder="Adicione tags para ajudar a organizar a tarefa..."
              />
            </TagsInput>
            <Textarea
              v-model="description"
              placeholder="Adicione uma descrição do que deve ser feito."
            />
            <div>
              <Label>Data de conclusão ideal.</Label>
              <Input type="date" v-model="dueDate" class="input" />
            </div>
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
import { Label } from "@/components/ui/label";
import { createTask, updateTask } from "@/utils/tasks";
import { Textarea } from "@/components/ui/textarea";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";

export default {
  components: {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Textarea,
    Button,
    Label,
    Input,
    SheetClose,
    TagsInput,
    TagsInputInput,
    TagsInputItem,
    TagsInputItemDelete,
    TagsInputItemText,
  },
  computed: {
    isValid() {
      return this.name.length > 3;
    },
    account() {
      return this.$store.state.account;
    },
    taskSheet() {
      return this.$store.state.taskSheet;
    },
    title() {
      return this.taskSheet.id ? "Edit task" : "New task";
    },
    buttonText() {
      return this.taskSheet.id ? "Save" : "Create";
    },
  },
  watch: {
    taskSheet() {
      if (this.taskSheet.id) {
        this.getData();
      }
    },
  },
  data() {
    return {
      name: "",
      dueDate: "",
      description: "",
      points: 0,
      tags: [],
    };
  },
  methods: {
    async getData() {
      const task = await getTask(this.taskSheet.id);
      this.name = task.data().name;
      this.description = task.data().description;
      this.tags = task.data().tags;
      this.points = task.data().points;
      this.dueDate = task.data().dueDate;
    },
    toggleOpen() {
      this.$store.commit("setTaskSheet", { status: false });
    },
    async submit() {
      const tagsParsed = this.tags.map((tag) => tag.toLowerCase());
      if (this.taskSheet.id) {
        await updateTask({
          id: this.taskSheet.id,
          data: {
            name: this.name,
            description: this.description,
            tags: this.tags,
            dueDate: this.dueDate,
            points: this.points,
            tagsParsed,
          },
        }).then(() => {
          this.$store.commit("addToast", {
            description: `Tarefa ${this.name} atualizada!`,
          });
        });
      } else {
        await createTask({
          data: {
            name: this.name,
            description: this.description,
            tags: this.tags,
            dueDate: this.dueDate,
            project_id: this.taskSheet.project_id,
            tagsParsed,
            points: this.points,
          },
        }).then((task) => {
          this.$store.commit("addToast", {
            description: `Tarefa ${this.name} criada!`,
          });
          this.$store.commit("setRedirect", this.$route.name);
          this.$router.push({
            name: "task",
            params: { task_id: task.id, project_id: this.taskSheet.project_id },
          });
        });
      }
      this.name = "";
      this.description = "";
      this.tags = [];
      this.points = 0;
      this.toggleOpen();
    },
  },
};
</script>
