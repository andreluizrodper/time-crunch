<template>
  <Dialog :open="teamDialog.status" @update:open="toggleOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Team</DialogTitle>
        <DialogDescription>
          This is the team dialog description.
        </DialogDescription>
      </DialogHeader>
      <div v-if="project" class="divide-y">
        <AccountAvatar
          v-for="account_id in project.data().shared_with"
          :key="account_id"
          :id="account_id"
          :showName="true"
          className="py-2"
        >
          <template v-slot="slotProps">
            <div v-if="slotProps.account" class="flex gap-2 items-center">
              <Button
                v-if="!slotProps.account.data().name"
                @click="copyLink(slotProps.account.id)"
                variant="outline"
                size="xs"
              >
                <Link size="14" />
              </Button>
              <Button
                v-if="slotProps.account.id !== project.data().owner"
                variant="outline"
                size="xs"
                @click="removeSharedWith(slotProps.account.id)"
              >
                <Trash size="14" />
              </Button>
            </div>
          </template>
        </AccountAvatar>
      </div>
      <div class="flex gap-2">
        <Input type="text" v-model="emails" placeholder="Convidar usuários" />
        <Button @click="invite">Convidar</Button>
      </div>
      <DialogFooter>
        <Button variant="ghost" @click="toggleOpen">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getProject } from "@/utils/projects";
import AccountAvatar from "@/components/ui/account-avatar.vue";
import { Input } from "@/components/ui/input";
import { getAccountByEmail, createAccount } from "@/utils/account";
import { updateProject } from "@/utils/projects";
import { Trash, Link } from "lucide-vue-next";

export default {
  components: {
    Dialog,
    Input,
    DialogContent,
    Trash,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Button,
    Link,
    AccountAvatar,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
    teamDialog() {
      return this.$store.state.teamDialog;
    },
  },
  watch: {
    teamDialog() {
      if (this.teamDialog.project_id) {
        this.getData();
      }
    },
  },
  data() {
    return {
      emails: "",
      project: null,
    };
  },
  methods: {
    async getData() {
      this.project = await getProject({ id: this.teamDialog.project_id });
    },
    toggleOpen() {
      this.$store.commit("setTeamDialog", { status: false });
    },
    async removeSharedWith(account_id) {
      await updateProject({
        id: this.project.id,
        data: {
          shared_with: this.project
            .data()
            .shared_with.filter((id) => id !== account_id),
        },
      });
      this.getData();
    },
    async copyLink(account_id) {
      const text = `${window.location.origin}/auth/invite/${account_id}`;
      navigator.clipboard.writeText(text);
    },
    async invite() {
      const emails = this.emails.split(",");
      const account_ids = [];
      for (const email of emails) {
        const parsedEmail = email.trim();
        const account = await getAccountByEmail({ email: parsedEmail });
        if (!account) {
          const newAccount = await createAccount({
            data: { email: parsedEmail },
            setStore: false,
          });
          account_ids.push(newAccount.id);
        } else {
          account_ids.push(account.id);
        }
      }
      await updateProject({
        id: this.project.id,
        data: {
          shared_with: [...this.project.data().shared_with, ...account_ids],
        },
      });
      this.getData();
      this.emails = "";
    },
  },
};
</script>
