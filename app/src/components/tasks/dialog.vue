<template>
  <Dialog v-if="task" :open="!!task" @update:open="toggleOpen">
    <DialogContent class="min-h-[96vh] gap-1 min-w-[96vw] flex flex-col">
      <DialogHeader>
        <div>
          <div class="gap-2 flex">
            <PlayButton :task="task" @update="getData" />
            <div class="flex flex-col gap-1 w-full">
              <div class="flex gap-4 items-center">
                <DialogTitle class="flex items-center gap-2">
                  <span class="uppercase">{{ task.data().code }}</span> -
                  {{ task.data().name }}
                </DialogTitle>
              </div>
              <span class="text-xs flex items-center gap-2">
                criado em {{ createdAtFormated }} last update
                {{ updatedAtFormated }}
                <span
                  class="flex gap-2 items-center"
                  v-if="task.data().time_spent"
                >
                  <Clock size="16" />
                  {{ timeSpentFormated }}
                </span>
              </span>
            </div>
            <div class="flex gap-2">
              <AddTask />
              <Button @click="toggleOpen" variant="outline" size="sm">
                <X :size="14" />
              </Button>
            </div>
          </div>
          <div class="mt-2 flex flex-col md:flex-row sm:items-center gap-4">
            <div
              class="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center md:pl-2"
            >
              <span class="text-sm text-left">Criado por: </span>
              <AccountAvatar :id="task.data().created_by" :showName="true" />
            </div>
            <div
              class="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:items-center md:pl-2"
            >
              <span class="text-sm text-left">Responsável: </span>
              <TaskOwnerSelection
                :task="task"
                :project="project"
                @getData="getData"
              />
            </div>
            <div class="justify-start flex gap-2">
              <BadgeStatusTask :task="task" @update="getData" />
              <TaskTypeBadge :task="task" @getData="getData" />
            </div>
            <TaskPointsPopOver @update="getData" :task="task" />
          </div>
        </div>
        <TaskTags :task="task" />
        <Timeline :task="task" />
      </DialogHeader>
      <div class="flex">
        <ToggleGroup v-model="tab" type="single">
          <ToggleGroupItem value="description"> Description </ToggleGroupItem>
          <ToggleGroupItem value="timeline"> Timeline </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div v-if="tab === 'description'" class="flex-1 py-2 flex flex-col gap-4">
        <div class="flex-1 flex" v-if="task.data().description">
          <Textarea
            v-if="edit"
            placeholder="Descrição..."
            v-model="description"
            @blur="updateDescription"
            class="flex-1"
          />
          <div v-else @click="edit = true" v-html="descriptionContent"></div>
        </div>
        <div class="flex-1 flex" v-else>
          <Textarea
            placeholder="Descrição..."
            v-model="description"
            @blur="updateDescription"
            class="flex-1"
          />
        </div>
        <div class="flex gap-4">
          <Card class="p-2" v-for="(file, index) in files" :key="file.src">
            <CardContent class="p-2">
              <img :src="file.src" class="size-32 object-cover" />
            </CardContent>
            <CardFooter class="p-2">
              <Button variant="outline" size="sm" as-child>
                <a :href="file.src" download target="_blank">
                  <Download size="16" />
                </a>
              </Button>
              <Button
                variant="outline"
                @click="removeFile(index)"
                size="sm"
                class="ml-2"
              >
                <Trash size="16" />
              </Button>
            </CardFooter>
          </Card>
          <vueDropzone
            ref="imgDropzone"
            id="dropzone"
            :options="dropzoneOptions"
            @vdropzone-complete="afterComplete"
            class="w-full"
          >
            <template #default="{ files }">
              <div class="dropzone">
                <div class="dropzone__files">
                  <div
                    v-for="file in files"
                    :key="file.name"
                    class="dropzone__file"
                  >
                    <img
                      v-if="file.type.includes('image')"
                      :src="file.data"
                      class="dropzone__img"
                    />
                    <p>{{ file.name }}</p>
                  </div>
                </div>
              </div>
            </template>
          </vueDropzone>
        </div>
      </div>
      <div v-if="tab === 'timeline'" class="flex-1 flex flex-col py-2">
        <TimelineItem
          v-for="(interval, index) in timeIntervalReversed"
          :key="index"
          :interval="interval"
        />
      </div>
      <Comments :project="project" :source="`task-${task.id}`" />
    </DialogContent>
  </Dialog>
</template>

<script>
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getTask, updateTask } from "@/utils/tasks";
import { Button } from "@/components/ui/button";
import { DateTime } from "luxon";
import Comments from "@/components/ui/comments/comments.vue";
import TaskTypeBadge from "@/components/tasks/type-badge.vue";
import { Textarea } from "@/components/ui/textarea";
import AccountAvatar from "@/components/ui/account-avatar.vue";
import TaskOwnerSelection from "@/components/tasks/owner-selection.vue";
import BadgeStatusTask from "@/components/tasks/status-badge.vue";
import { Clock, Download, Trash, X } from "lucide-vue-next";
import vueDropzone from "dropzone-vue3";
import { v4 as uuidv4 } from "uuid";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PlayButton from "@/components/tasks/play-button.vue";
import Timeline from "@/components/tasks/timeline.vue";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import TimelineItem from "@/components/tasks/timeline-item.vue";
import TaskTags from "@/components/tasks/tags.vue";
import AddTask from "@/components/tasks/add-task.vue";
import TaskPointsPopOver from "@/components/tasks/points-pop-over.vue";

export default {
  props: {
    redirect: {
      type: Object,
    },
    project: {
      type: Object,
      required: true,
    },
  },
  components: {
    TimelineItem,
    TaskTags,
    ToggleGroup,
    ToggleGroupItem,
    BadgeStatusTask,
    Clock,
    X,
    TaskOwnerSelection,
    Comments,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    TaskTypeBadge,
    Textarea,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    AccountAvatar,
    vueDropzone,
    Download,
    Card,
    CardContent,
    Trash,
    PlayButton,
    CardFooter,
    Timeline,
    AddTask,
    TaskPointsPopOver,
  },
  data() {
    return {
      tab: "description",
      task: null,
      description: null,
      files: [],
      edit: false,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 150,
        thumbnailHeight: 150,
        useCustomSlot: true,
        addRemoveLinks: false,
        acceptedFiles: "image/*,application/pdf",
      },
    };
  },
  computed: {
    timeIntervalReversed() {
      return this.task.data().time_intervals?.reverse() ?? null;
    },
    descriptionContent() {
      let content = this.task.data().description;
      content = content.replace(/\n/g, "<br />").split(" ");
      for (let i = 0; i < content.length; i++) {
        if (content[i].startsWith("http")) {
          content[
            i
          ] = `<a href="${content[i]}" class="underline" target="_blank">${content[i]}</a>`;
        }
      }
      return content.join(" ");
    },
    timeSpentFormated() {
      const timeSpentMillis = this.task.data().time_spent;
      const timeSpentSeconds = timeSpentMillis / 1000;
      const minutes = Math.floor((timeSpentSeconds % 3600) / 60);
      const hours = Math.floor(timeSpentSeconds / 3600);
      const days = Math.floor(hours / 24);
      return `${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${
        minutes ? `${minutes}m` : ""
      }`;
    },
    createdAtFormated() {
      return DateTime.fromJSDate(
        this.task.data().created_at.toDate()
      ).toRelative();
    },
    updatedAtFormated() {
      return DateTime.fromJSDate(
        this.task.data().updated_at.toDate()
      ).toRelative();
    },
    account() {
      return this.$store.state.account;
    },
  },
  mounted() {
    if (this.$route.params.task_id) {
      this.getData();
    }
  },
  methods: {
    removeFile(index) {
      this.files.splice(index, 1);
      updateTask({
        id: this.task.id,
        data: { files: this.files },
      });
    },
    async afterComplete(file) {
      try {
        const storage = getStorage();
        const file_ext = file.name.split(".").pop();
        const imageName = uuidv4();
        this.storageRef = ref(
          storage,
          `${this.task.data().project_id}/${
            this.task.id
          }/${imageName}.${file_ext}`
        );
        this.upload = true;
        uploadBytes(this.storageRef, file).then(() => {
          getDownloadURL(this.storageRef).then((url) => {
            this.files.push({
              src: url,
              added_by: this.account.data().name,
              added_at: new Date(),
            });
            this.$refs.imgDropzone.removeFile(file);
            updateTask({
              id: this.task.id,
              data: { files: this.files },
            });
          });
        });
      } catch (error) {
        console.log(error);
      }
    },
    toggleOpen() {
      this.task = null;
      const redirect = this.$store.state.redirect;
      this.$router.push({
        name: redirect ?? "list",
        params: { id: this.$route.params.id },
      });
    },
    async updateDescription() {
      updateTask({
        id: this.task.id,
        data: { description: this.description },
      }).then(() => {
        this.getData();
        this.edit = false;
      });
    },
    async getData() {
      this.task = await getTask({ id: this.$route.params.task_id });
      this.files = this.task.data().files || [];
      this.description = this.task.data().description;
    },
  },
};
</script>
