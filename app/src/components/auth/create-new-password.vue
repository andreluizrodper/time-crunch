<template>
  <div class="grid gap-6">
    <form @submit.prevent="setNewPassword">
      <div class="grid gap-2">
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
          <div class="text-right">
            <router-link
              class="text-gray-600 text-sm"
              :to="{ name: 'forgot-password' }"
            >
              Esqueceu a senha?
            </router-link>
          </div>
        </div>
        <Button :disabled="isLoading">
          <LoaderCircle v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Criar nova senha e entrar
        </Button>
      </div>
    </form>

    <Button variant="link" size="sm" as-child>
      <router-link
        class="text-gray-600 text-base text-center"
        :to="{ name: 'login' }"
      >
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
import { loginAccount } from "@/utils/account.js";
import {
  confirmPasswordReset,
  verifyPasswordResetCode,
  signInWithEmailAndPassword,
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
      isLoading: false,
      error: false,
      message: "",
    };
  },
  async created() {
    await verifyPasswordResetCode(auth, this.$route.query.oobCode)
      .then((email) => {
        this.email = email;
      })
      .catch((e) => {
        this.$store.commit("addToast", {
          title: "Erro",
          description: "O link de redefinição de senha é inválido.",
        });
        this.$router.push("/auth/forgot-password");
      });
  },
  methods: {
    async setNewPassword() {
      this.isLoading = true;
      this.error = false;
      this.message = "";
      await confirmPasswordReset(auth, this.$route.query.oobCode, this.pwd)
        .then(async (result) => {
          signInWithEmailAndPassword(auth, this.email, this.pwd)
            .then(async (result) => {
              this.$store.commit("setUser", result.user);
              const logged = await loginAccount({ id: result.user.uid });
              if (!logged) {
                this.isLoading = false;
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
              this.isLoading = false;
              this.$store.commit("addToast", {
                title: "Erro",
                description: "Usuário não encontrado ou senha incorreta",
              });
              this.error = true;
            });
        })
        .catch((e) => {
          this.isLoading = false;
          this.$store.commit("addToast", {
            title: "Erro",
            description: "Ocorreu um erro ao redefinir sua senha.",
          });
        });
    },
  },
};
</script>
@/utils/account.js
