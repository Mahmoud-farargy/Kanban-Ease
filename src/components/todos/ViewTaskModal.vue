<template>
  <Modal :isOpen="isTaskViewOpen" :changeModalState="changeTaskViewerState" :modalTitle="memoizedModalTitle">
    <!-- modal body -->
    <div class="space-y-4 p-4 md:p-5">
      <!-- Task Name -->
      <div>
        <h3 class="text-gray-700 dark:text-gray-400/90 font-medium">{{ $t("form_labels.name") }}</h3>
        <p class="text-gray-900 dark:text-gray-200">{{ props.viewItemData[nameKey] }}</p>
      </div>

      <!-- Description -->
      <div>
        <h3 class="text-gray-700 dark:text-gray-400/90 font-medium">{{ $t("form_labels.description") }}</h3>
        <p class="text-gray-900 dark:text-gray-200">{{ props.viewItemData[descriptionKey] }}</p>
      </div>

      <!-- Priority Level -->
      <div>
        <h3 class="text-gray-700 dark:text-gray-400/90 font-medium">{{ $t("form_labels.priority_level") }}</h3>
        <p :class="`${priorityClass} capitalize`.trim()">{{ $t(`priorities.${props.viewItemData.priority_level}`) }}</p>
      </div>

      <!-- Status -->
      <div>
        <h3 class="text-gray-700 dark:text-gray-400/90 font-medium">{{ $t("form_labels.status") }}</h3>
        <p class="text-gray-900 dark:text-gray-200 capitalize">{{ props.viewItemData.status }}</p>
      </div>

      <!-- Due Date -->
      <div>
        <h3 class="text-gray-700 dark:text-gray-400/90 font-medium">{{ $t("form_labels.due_date") }}</h3>
        <p class="text-gray-900 dark:text-gray-200">{{ formattedDate }}</p>
      </div>
    </div>
    <!-- modal footer -->
    <div class="flex justify-center items-center gap-3 p-3 border-t rounded-t dark:border-gray-600">
      <button @click="() => changeTaskViewerState(false)" type="button"
        class="text-dark primary-button-bg hover:brightness-95 transition-[filter] duration-150 font-medium rounded-lg text-sm px-5 py-2 text-center">
        {{ $t("ok") }}
      </button>
    </div>
  </Modal>
</template>

<script setup>
import { Modal } from "@/components/generic";
import { defineProps, computed, ref } from "vue";
import moment from "moment-timezone";
import '@/helpers/moment-locales/ar';

const props = defineProps({
  isTaskViewOpen: {
    type: Boolean,
    required: true,
    default: false
  },
  changeTaskViewerState: {
    type: Function,
    required: true
  },
  viewItemData: {
    type: Object,
    required: true,
    default: () => ({})
  },
  nameKey: {
    type: String,
    required: true,
    default: "name_en"
  },
  descriptionKey: {
    type: String,
    required: true,
    default: "description_en"
  },
  currentLanguage: {
    type: String,
    default: 'en',
    required: true
  },
})

const memoizedModalTitle = computed(() => {
  return props.viewItemData?.[props.nameKey];
});

// Format due date
const formattedDate = ref(moment(props.viewItemData.due_date).locale(props.currentLanguage).format('MMMM Do YYYY, h:mm A'));

// Priority class based on priority level
const priorityClass = ref({
  'text-red-500 font-semibold': props.viewItemData.priority_level === 'urgent',
  'text-yellow-500 font-semibold': props.viewItemData.priority_level === 'high',
  'text-blue-700 font-semibold': props.viewItemData.priority_level === 'medium',
  'text-gray-700 font-semibold': props.viewItemData.priority_level === 'low',
});
</script>