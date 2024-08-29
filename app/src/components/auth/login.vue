<template>
  <div class="grid gap-6">
    <form @submit.prevent="doLogin">
      <div class="grid gap-3">
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
            :disabled="loading"
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
            :disabled="loading"
          />
          <div class="text-right">
            <router-link
              class="text-gray-600 text-sm"
              :to="{ name: 'forgot-password' }"
            >
              Esqueceu a senha?
            </router-link>
          </div>
        </div>
        <Button :disabled="loading">
          <LoaderCircle v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
          Entrar
        </Button>
      </div>
    </form>
    <hr />
    <div class="flex justify-center">
      <Button @click="doLoginGoogle" variant="outline">
        <span class="flex justify-center items-center gap-4">
          <img src="@/assets/google.png" class="w-[24px]" />
          Entrar com Google
        </span>
      </Button>
    </div>
  </div>
</template>

<script>
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-vue-next";
import { loginAccount, createAccount, accountExists } from "@/utils/account.js";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/utils/firebase.js";

export default {
  components: {
    Button,
    Input,
    Label,
    LoaderCircle,
  },
  data() {
    return {
      email: "",
      pwd: "",
      loading: false,
      error: false,
      message: "",
    };
  },
  methods: {
    doLoginGoogle() {
      const provider = new GoogleAuthProvider();

      signInWithPopup(auth, provider).then(async (result) => {
        const doAccountExists = await accountExists({ id: result.user.uid });
        if (!doAccountExists) {
          this.$store.commit("addToast", {
            description:
              "Esta conta não existe, vamos te enviar um convite assim que eles estiverem disponiveis",
          });
        } else {
          await loginAccount({ id: result.user.uid });
          this.$router.push({ name: "dashboard" });
        }
      });
    },
    doLogin() {
      this.loading = true;
      this.error = false;
      this.message = "";
      signInWithEmailAndPassword(auth, this.email, this.pwd)
        .then(async (result) => {
          this.$store.commit("setUser", result.user);
          const logged = await loginAccount({ id: result.user.uid });
          if (!logged) {
            this.loading = false;
            this.$store.commit("addToast", {
              title: "Erro",
              description: "Conta não está ativa",
            });
            this.error = true;
          } else {
            this.$router.push({ name: "dashboard" });
          }
        })
        .catch((e) => {
          this.loading = false;
          this.$store.commit("addToast", {
            title: "Erro",
            description: "Usuário não encontrado ou senha incorreta",
          });
          this.error = true;
        });
    },
  },
};
</script>
@/utils/account.js
