<template>
  <div class="grid gap-6">
    <form @submit.prevent="doCreateAccount">
      <div class="grid gap-2">
        <div class="grid gap-1">
          <Label class="sr-only" for="name"> Nome </Label>
          <Input
            v-model="name"
            id="name"
            placeholder="Seu nome"
            type="text"
            auto-capitalize="none"
            auto-correct="off"
            :disabled="isLoading"
          />
        </div>
        <div class="grid gap-1">
          <Label class="sr-only" for="email"> Email </Label>
          <Input
            v-model="email"
            id="email"
            placeholder="Seu email"
            type="email"
            auto-capitalize="none"
            auto-complete="email"
            auto-correct="off"
            disabled
          />
        </div>
        <div class="grid gap-1">
          <Label class="sr-only" for="password"> Senha </Label>
          <Input
            v-model="pwd"
            id="password"
            placeholder="Sua senha"
            type="password"
            auto-capitalize="none"
            auto-correct="off"
            :disabled="isLoading"
          />
        </div>
        <Button :disabled="isLoading">
          <LoaderCircle v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Criar a minha conta
        </Button>
      </div>
    </form>
    <Button variant="link" size="sm" as-child>
      <router-link
        class="text-gray-600 text-base text-center text-sm items-center flex justify-center hover:text-gray-800"
        :to="{ name: 'login' }"
      >
        <ArrowLeft class="mr-2 h-4 w-4 inline" />
        Entrar na sua conta
      </router-link>
    </Button>
  </div>
</template>

<script>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-vue-next";
import { updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase.js";
import { updateAccount } from "@/utils/account.js";
import { ArrowLeft } from "lucide-vue-next";
import { getAccount, loginAccount } from "@/utils/account.js";

export default {
  components: {
    Button,
    Input,
    Label,
    LoaderCircle,
    ArrowLeft,
  },
  data() {
    return {
      name: "",
      email: "",
      pwd: "",
      isLoading: false,
      error: false,
      message: "",
      account: null,
    };
  },
  async mounted() {
    this.account = await getAccount({
      id: this.$route.params.account_id,
      setStore: false,
    });
    this.email = this.account.data().email;
  },
  methods: {
    doCreateAccount() {
      this.isLoading = true;
      this.error = false;
      this.message = "";
      createUserWithEmailAndPassword(auth, this.email, this.pwd)
        .then(async (result) => {
          await updateProfile(auth.currentUser, {
            displayName: this.name,
          });
          this.$store.commit("setUser", result.user);
          const data = {
            name: this.name,
            email: this.email,
            owner: result.user.uid,
            active: true,
          };
          this.isLoading = false;
          await updateAccount({ id: this.$route.params.account_id, data });
          await loginAccount({ id: result.user.uid });
          this.$router.push({ name: "dashboard" });
        })
        .catch((error) => {
          this.isLoading = false;
          if (error.message?.indexOf("email-already-in-use") > 0) {
            this.message = "E-mail já em uso.";
          } else {
            this.message = error.message;
          }
          this.error = true;
        });
    },
  },
};
</script>
@/utils/account.js
