<template>
  <div class="h-[100vh] flex flex-col">
    <div class="bg-purple-900">
      <div class="py-6 text-white px-4">
        <div class="w-full flex justify-between items-center">
          <h1 class="text-xl">Time Crunch</h1>
          <a href="https://app.timecrunch.org" class="underline text-sm">
            Let's start
          </a>
        </div>
      </div>
    </div>
    <div class="bg-gray-50 flex-1 flex">
      <div class="flex flex-col w-full">
        <div class="py-8">
          <p class="text-center w-full text-base px-4">
            Welcome to a new way to <strong>manage projects</strong>, and also,
            <strong>your day</strong>, actually, we will not let you feel down
            for doing less <strong>than you expect</strong>
          </p>
        </div>
        <div class="flex-1 relative overflow-hidden flex">
          <div class="max-w-7xl px-4 flex w-full items-center flex-1 mx-auto">
            <div class="flex-1 flex items-center justify-end relative z-30">
              <div>
                <div class="flex flex-col gap-2 text-gray-600">
                  <div
                    class="p-3 bg-white shadow-sm flex flex-col gap-2 rounded"
                  >
                    <p class="text-sm">Send me an invite when you got them!</p>
                    <form class="w-full flex gap-2">
                      <input
                        type="email"
                        v-model="email"
                        class="border rounded px-4 py-1 w-full"
                      />
                      <button
                        class="px-2 border rounded bg-purple-600 hover:bg-purple-800 text-white"
                      >
                        <Send size="16" />
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute left-0 bottom-0">
            <Vue3Lottie :animationData="AnimJSON" :width="400" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex py-2 px-4 flex justify-between items-center">
      <p class="text-xs">{{ year }} &copy;NearFutureLab</p>
      <div>
        <a href="mailto:andreluizrodper@gmail.com" class="text-xs underline"
          >Contact</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { Send } from "lucide-vue-next";
import { Vue3Lottie } from "vue3-lottie";
import AnimJSON from "@/assets/anim.json";

export default {
  components: {
    Send,
    Vue3Lottie,
  },
  computed: {
    year() {
      return new Date().getFullYear();
    },
  },
  data() {
    return {
      AnimJSON,
    };
  },
};
</script>
