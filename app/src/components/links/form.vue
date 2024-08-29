<template>
  <Sheet :open="linkSheet.status" @update:open="toggleOpen">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>{{ title }}</SheetTitle>
        <SheetDescription>
          <form @submit.prevent="submit" class="space-y-4 mt-4">
            <Input
              type="text"
              v-model="name"
              placeholder="Nome"
              class="input"
            />
            <Input type="text" v-model="url" placeholder="Link" class="input" />
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
import { createLink, getLink, updateLink } from "@/utils/links";
import { Textarea } from "@/components/ui/textarea";

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
    Input,
    SheetClose,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    linkSheet() {
      return this.$store.state.linkSheet;
    },
    title() {
      return this.linkSheet.id ? "Edit link" : "New link";
    },
    buttonText() {
      return this.linkSheet.id ? "Save" : "Create";
    },
  },
  watch: {
    linkSheet() {
      if (this.linkSheet.id) {
        this.getData();
      }
    },
  },
  data() {
    return {
      name: "",
      url: "",
    };
  },
  methods: {
    async getData() {
      const link = await getLink(this.linkSheet.id);
      this.name = link.data().name;
      this.url = link.data().url;
    },
    toggleOpen() {
      this.$store.commit("setLinkSheet", { status: false });
    },
    async submit() {
      if (this.linkSheet.id) {
        await updateLink({
          id: this.linkSheet.id,
          data: {
            name: this.name,
            url: this.url,
          },
        });
      } else {
        await createLink({
          data: {
            name: this.name,
            url: this.url,
            project_id: this.linkSheet.project_id,
          },
        });
      }
      this.name = "";
      this.url = "";
      this.toggleOpen();
    },
  },
};
</script>
