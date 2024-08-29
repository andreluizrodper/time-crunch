<template>
  <div>
    <RouterView />
    <Toaster />
  </div>
</template>

<script>
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase.js";
import { RouterView } from "vue-router";
import { loginAccount, accountExists } from "@/utils/account.js";
import Toaster from "@/components/ui/toast/Toaster.vue";

export default {
  components: {
    RouterView,
    Toaster,
  },
  computed: {
    account() {
      return this.$store.state.account;
    },
  },
  name: "App",
  created() {
    this.$store.commit(
      "setTheme",
      window.localStorage.getItem("theme_timecrunch") || "light"
    );
    onAuthStateChanged(auth, async (user) => {
      if (!user) this.$router.push({ name: "login" });
      if (user && !this.account) {
        const checkAccountExists = await accountExists({ id: user.uid });
        if (checkAccountExists) {
          this.$store.commit("setUser", user);
          loginAccount({ id: user.uid });
          this.loading = false;
          if (this.$route.path === "/") {
            this.$router.push({ name: "dashboard" });
          }
        } else {
          this.loading = false;
        }
      } else {
        if (this.$route.path.includes("dashboard")) {
          this.$router.push({ name: "login" });
        }
        this.loading = false;
      }
    });
  },
};
</script>
@/utils/account.js
