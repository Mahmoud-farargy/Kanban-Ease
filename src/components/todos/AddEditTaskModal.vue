<template>
  <!-- Modals -->
  <Modal :isOpen="isTaskModalOpen" :changeModalState="props.changeTaskModalState" :modalTitle="modalTitle">
    <!-- Modal body -->
    <form @submit.prevent="onTaskSubmission">
      <!-- modal form -->
      <div class="space-y-4 p-4 md:p-5">
        <!-- Name in English -->
        <div>
          <label for="name_en" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
    $t("form_labels.name_in_english") }}
            <strong class="text-red-500">*</strong>
          </label>
          <input v-model="taskform.name_en" type="text" name="name_en" id="name_en"
            class="bg-gray-50 border outline-lime-500 transition-colors duration-150 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Doing the dishes" />
          <!-- error -->
          <div v-if="v$ && v$.name_en && v$.name_en.$errors">
            <p v-for="error of v$.name_en.$errors" :key="error.$uid"
              class="error_message p-4 mb-4 flex flex-column text-sm mt-2 text-red-800 rounded-lg bg-red-50"
              role="alert">
              {{ error.$message }}
            </p>
          </div>
        </div>
        <!-- Name in Arabic -->
        <div>
          <label for="name_ar" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ $t("form_labels.name_in_arabic") }}
            <strong class="text-red-500">*</strong>
          </label>
          <input v-model="taskform.name_ar" type="text" name="name_ar" id="name_ar"
            class="bg-gray-50 border outline-lime-500 transition-colors duration-150 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="التنزه مع اﻷصدقاء" />
          <!-- error -->
          <div v-if="v$ && v$.name_ar && v$.name_ar.$errors">
            <p v-for="error of v$.name_ar.$errors" :key="error.$uid"
              class="error_message p-4 mb-4 flex flex-column text-sm mt-2 text-red-800 rounded-lg bg-red-50"
              role="alert">
              {{ error.$message }}
            </p>
          </div>
        </div>
        <!-- Description -->
        <div>
          <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
    $t("form_labels.description") }}
            <strong class="text-red-500">*</strong>
          </label>
          <textarea v-model="taskform.description" type="text" name="description" id="description"
            class="bg-gray-50 border outline-lime-500 transition-colors duration-150 border-gray-300 text-gray-900 text-sm min-h-[5.7rem] max-h-[12.5rem] resize-y rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Describe the task..." />
          <!-- error -->
          <div v-if="v$ && v$.description && v$.description.$errors">
            <p v-for="error of v$.description.$errors" :key="error.$uid"
              class="error_message p-4 mb-4 flex flex-column text-sm mt-2 text-red-800 rounded-lg bg-red-50"
              role="alert">
              {{ error.$message }}
            </p>
          </div>
        </div>
        <!-- Priority Level -->
        <div>
          <label for="priority_level" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ $t("form_labels.priority_level") }}
            <strong class="text-red-500">*</strong>
          </label>
          <select v-model="taskform.priority_level" id="priority_level" name="priority_level"
            class="bg-gray-50 border outline-lime-500 transition-colors duration-150 capitalize border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
            <option v-for="(option, idx) in proirityOptions" :key="option.id || idx" :value="option.id"
              class="capitalize">
              {{ option[props.nameKey] }}
            </option>
          </select>
          <!-- error -->
          <div v-if="v$ && v$.priority_level && v$.priority_level.$errors">
            <p v-for="error of v$.priority_level.$errors" :key="error.$uid"
              class="error_message p-4 mb-4 flex flex-column text-sm mt-2 text-red-800 rounded-lg bg-red-50"
              role="alert">
              {{ error.$message }}
            </p>
          </div>
        </div>
        <!-- Status -->
        <div>
          <label for="status" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ $t("form_labels.status") }}
            <strong class="text-red-500">*</strong>
          </label>
          <select v-model="taskform.status" id="status" name="status"
            class="bg-gray-50 border outline-lime-500 transition-colors duration-150 capitalize border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
            <option v-for="(option, idx) in statusOptions" :key="option.id || idx" :value="option.id"
              class="capitalize">
              {{ option[props.nameKey] }}
            </option>
          </select>
          <!-- error -->
          <div v-if="v$ && v$.status && v$.status.$errors">
            <p v-for="error of v$.status.$errors" :key="error.$uid"
              class="error_message p-4 mb-4 flex flex-column text-sm mt-2 text-red-800 rounded-lg bg-red-50"
              role="alert">
              {{ error.$message }}
            </p>
          </div>
        </div>
        <!-- Due Date -->
        <div>
          <label for="due_date" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {{ $t("form_labels.due_date") }}
            <strong class="text-red-500">*</strong>
          </label>
          <input v-model="taskform.due_date" type="datetime-local" name="due_date" id="due_date" :min="minDate()"
            class="bg-gray-50 border outline-lime-500 transition-colors duration-150 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
          <!-- error -->
          <div v-if="v$ && v$.due_date && v$.due_date.$errors">
            <p v-for="error of v$.due_date.$errors" :key="error.$uid"
              class="error_message p-4 mb-4 flex flex-column text-sm mt-2 text-red-800 rounded-lg bg-red-50"
              role="alert">
              {{ error.$message }}
            </p>
          </div>
        </div>
      </div>
      <!-- modal footer -->
      <div class="flex items-center gap-3 p-3 mt-3 border-t rounded-t dark:border-gray-600">
        <button type="submit"
          class="text-dark primary-button-bg hover:brightness-95 transition-[filter] duration-150 font-medium rounded-lg text-sm px-5 py-2 text-center`">
          {{ props.operationType === "edit" ? $t("save") : $t("ok") }}
        </button>
        <button @click="() => props.changeTaskModalState(false)" type="button"
          class="text-primary bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary/20 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2 hover:text-primary/90 focus:z-10">
          {{ $t("cancel") }}
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { Modal } from "@/components/generic";
import { useGlobalStore } from "@/store/Modules/global";
import { useI18n } from "vue-i18n";
import useVuelidate from "@vuelidate/core";
import { VALIDATIONS, generateRandomId } from "@/helpers";
import { defineEmits } from "vue";

const { t } = useI18n();
const globalStore = useGlobalStore();
const emit = defineEmits();

const props = defineProps({
  nameKey: {
    type: String,
    required: true,
    default: "name_en",
  },
  isTaskModalOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
  changeTaskModalState: {
    type: Function,
    required: true,
  },
  operationType: {
    type: String,
    required: true,
    default: "add",
  },
  editItemData: {
    type: Object,
    required: false,
    default: () => ({}),
  },
});

const taskform = ref({
  name_en: "",
  name_ar: "",
  description: "",
  priority_level: "",
  status: "",
  due_date: "",
});

const rules = {
  name_en: {
    ...VALIDATIONS.name,
  },
  name_ar: {
    ...VALIDATIONS.name,
  },
  description: {
    ...VALIDATIONS.description,
  },
  priority_level: {
    ...VALIDATIONS.requiredInput,
  },
  status: {
    ...VALIDATIONS.requiredInput,
  },
  due_date: {
    ...VALIDATIONS.requiredInput,
  },
};
const v$ = useVuelidate(rules, taskform);

const minDate = () => {
  const today = new Date();
  return today.toISOString().slice(0, 16);
};

const modalTitle = computed(() => {
  return props.operationType == "edit"
    ? t("edit_task", { taskName: props.editItemData[props.nameKey] })
    : t("add_task");
});
const proirityOptions = computed(() => {
  const defaultOption = {
    name_ar: "قم إختيار الأولوية",
    name_en: "Select a priority",
    id: "",
  };
  return [
    defaultOption,
    { id: "low", name_ar: "منخفض", name_en: "Low" },
    { id: "medium", name_ar: "متوسط", name_en: "medium" },
    { id: "high", name_ar: "عالي", name_en: "High" },
    { id: "urgent", name_ar: "ضروري", name_en: "urgent" },
  ];
});

const statusOptions = computed(() => {
  const taskColumns = globalStore.getColumnsData || [];
  const defaultOption = {
    name_ar: "قم إختيار الحالة",
    name_en: "Select a status",
    id: "",
  };
  return [defaultOption, ...taskColumns];
});

const resetFormDataAndValidation = () => {
  Object.keys(taskform.value || {}).forEach(
    (formItem) => (taskform.value[formItem] = "")
  );
  v$.value.$reset();
};

const computedTaskModalState = computed(() => props.isTaskModalOpen);
watch(computedTaskModalState, (isOpen) => {
  const isBool = typeof isOpen === "boolean";
  const isClosed = !isOpen;
  const isAdd = props.operationType !== "edit";

  if (isBool && isClosed && isAdd) {
    resetFormDataAndValidation();
  }
});

const onTaskSubmission = () => {
  v$.value.$touch(); // Mark all fields as touched
  if (v$.value.$invalid) {
    return;
  }

  let dataToSubmit = {
    ...taskform.value,
    ...(props.operationType === "add" ? {
      // generate an id when adding a new task
      id: generateRandomId(),
    } : {
      ...props.editItemData.id
    })
  };
  // emits the onSubmission event to the parent
  emit("onSubmission", dataToSubmit);
  // closes the modal
  props.changeTaskModalState(false);
};

const memoizedEditData = computed(() => props.editItemData);
watch(
  memoizedEditData,
  (editItem = {}) => {
    if (props.operationType === "edit") {
      // Auto-populate the editItemData object to the form inputs if a case of editing and the modal is open
      Object.entries(editItem).forEach(([key, value]) => {
        if (key in taskform.value) {
          taskform.value[key] = value || "";
        }
      });
    }
  },
  { flush: "post" }
);
</script>
