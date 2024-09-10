<template>
  <Page title="Todo Organizer" description="">
    <!-- Confirmation dialog -->
    <ConfirmationDialog ref="confirmationDialogRef" :confirmationDialogData="confirmationDialogData" />

    <!-- Edit Task Modal -->
    <AddEditTaskModal :nameKey="nameKey" operationType="edit" :isTaskModalOpen="isTaskEditorModalOpen"
      :editItemData="editTaskItemData && editTaskItemData.data" :changeTaskModalState="changeTaskEditorModalState"
      @onSubmission="onTaskEditSubmission" />

    <!-- Add Column Modal -->
    <AddEditColumnModal :nameKey="nameKey" operationType="add" :isColumnModalOpen="isAddColumnModalOpen"
      :changeColumnModalState="changeAddColumnModalState" @onSubmission="onColumnSubmission"
      :currentColumnsLength="currentColumnsLength" />

    <!-- Edit Column Modal -->
    <AddEditColumnModal :nameKey="nameKey" operationType="edit" :isColumnModalOpen="isEditColumnModalOpen"
      :editItemData="editColumnItemData" :changeColumnModalState="changeEditColumnModalState"
      @onSubmission="onColumnSubmission" :currentColumnsLength="currentColumnsLength" />

    <!-- View Task modal -->
    <ViewTaskModal :nameKey="nameKey" :isTaskViewOpen="isTaskViewOpen" :changeTaskViewerState="changeTaskViewerState"
      :viewItemData="viewItemData" :currentLanguage="currentLanguage" />

    <!-- Header - Controls  -->
    <Header :nameKey="nameKey" :changeAddColumnModalState="changeAddColumnModalState" />
    <!-- Todos main board -->
    <section
      class="min-h-[100vh] h-[calc(100vh_-_var(--header-height-desktop)_-_var(--header-margin-bottom-desktop))]">
      <div
        class="overflow-x-auto overflow-y-hidden h-full relative w-full hide-scrollbar whitespace-nowrap px-5 sm:px-7"
        ref="scrollContainer" @drag="handleAutoScrollOnDrag">
        <div class="inline-flex h-full">
          <!-- Columns -->
          <div v-if="!areTasksEmpty" class="flex flex-nowrap h-full gap-4">
            <div v-for="(column, index) in sortedAndFilteredColumns" :key="column.id"
              class="h-full w-[var(--task-card-width-mobile)] lg:w-[var(--task-card-width-desktop)]">
              <div class="mb-2">
                <ColumnItemHeader :itemTitle="column[nameKey]"
                  :columnTasksCount="(column && column.tasks) ? column.tasks.length : 0"
                  :onEditColumnClick="onEditColumnClick" :onDeleteColumnClick="onDeleteColumnClick" :column="column" />
                <div :style="{ backgroundColor: column.color }" class="w-full h-[3px]"></div>
              </div>
              <div class="h-full">
                <Draggable ghost-class="ghost" v-model="columnsOriginalData[index].tasks" @start="onStartPulling()"
                  @end="onFinishPulling()" @update="(e) => onMovingInSameColumn(e, column.id)"
                  @add="(e) => onMovingToAnotherColumn(e, column.id)" group="tasks" handle=".handle"
                  class="w-full h-full max-h-lvh md:max-h-[100vh] overscroll-none column__scrollbar overflow-y-auto">
                  <!-- Column tasks -->
                  <TaskItem v-for="(item, index) in column.tasks" :key="item.id" :item="item" :nameKey="nameKey"
                    :index="index" @onEditItem="onEditTask" @onDeleteItem="onDeleteItem" @onViewItem="onViewItem"
                    :currentLanguage="currentLanguage" :isPullingCard="isPullingCard" />
                </Draggable>
              </div>
            </div>
          </div>
          <div v-else>
            <h3 class="text-dark-500 dark:text-dark-300 font-bold mt-28">
              {{ $t('no_tasks_available') }} 
            </h3>
          </div>
        </div>
      </div>
    </section>
  </Page>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { Page, ConfirmationDialog, Modal } from "@/components/generic";
import { VueDraggableNext as Draggable } from "vue-draggable-next";
import { useGlobalStore } from "@/store/Modules/global";
import { useLocalStorage, lowerString } from "@/helpers";
import AddEditTaskModal from "@/components/todos/AddEditTaskModal.vue";
import AddEditColumnModal from "@/components/todos/AddEditColumnModal.vue";
import ViewTaskModal from "@/components/todos/ViewTaskModal.vue";
import Header from "@/components/todos/Header.vue";
import TaskItem from "@/components/todos/TaskItem.vue";
import ColumnItemHeader from "@/components/todos/ColumnItemHeader.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const globalStore = useGlobalStore();
const scrollContainer = ref(null);
const isTaskEditorModalOpen = ref(false);
const isAddColumnModalOpen = ref(false);
const isEditColumnModalOpen = ref(false);
const isTaskViewOpen = ref(false);
const editTaskItemData = ref({});
const editColumnItemData = ref({});
const viewItemData = ref({});
const isPullingCard = ref(false);
const confirmationDialogRef = ref(null);
const confirmationDialogData = ref({
  title: '',
  confirmedFunc: () => { },
});
const columnsOriginalData = ref([]);
const sortedAndFilteredColumns = ref(null);

const changeTaskEditorModalState = (newValue) => {
  isTaskEditorModalOpen.value = newValue;
};

const changeTaskViewerState = (newValue) => {
  isTaskViewOpen.value = newValue;
}

const changeAddColumnModalState = (newValue) => {
  isAddColumnModalOpen.value = newValue;
}

const changeEditColumnModalState = (newValue) => {
  isEditColumnModalOpen.value = newValue;
}

const memoizedSeachValue = computed(() => globalStore?.getSearchValue);
const memoizedColumnsOriginalData = computed(() => columnsOriginalData?.value);

watch(([memoizedSeachValue, memoizedColumnsOriginalData]), ([newSearchVal, newColumnsOriginalVal]) => {
  // Make a copy of the memoizedColumnsOriginalData array for UI manipulation
  sortedAndFilteredColumns.value = newColumnsOriginalVal?.sort((a, b) => a.order - b.order)?.map((column) => {
    return {
      ...column,
      tasks: column.tasks?.filter((task) => {
        const lowerCasedSearchValue = lowerString(newSearchVal);
        const isNameArMatchingASearchValue = lowerString(task.name_ar).includes(lowerCasedSearchValue);
        const isNameEnMatchingASearchValue = lowerString(task.name_en).includes(lowerCasedSearchValue);
        const isDescriptionMatchingASearchValue = lowerString(task.description).includes(lowerCasedSearchValue);
        return isNameArMatchingASearchValue || isNameEnMatchingASearchValue || isDescriptionMatchingASearchValue;
      })
    }
  });
}, {deep: true});


const areTasksEmpty = computed(() => {
  return sortedAndFilteredColumns.value?.length <=0;
});

const currentLanguage = computed(() => globalStore?.getCurrentLanguage);

const nameKey = computed(() => {
  // switches between name_ar & name_en based on the current language
  const isArabic = currentLanguage.value === 'ar';
  return `name_${isArabic ? 'ar' : 'en'}`;
});

const currentColumnsLength = computed(() => {
  return globalStore.getColumnsData?.length
})

const handleAutoScrollOnDrag = (event) => {
  const container = scrollContainer.value;
  const threshold = 100; // Distance from the edge to trigger scroll
  const scrollSpeed = 10; // Scroll speed adjustment

  if (event.clientX - container.getBoundingClientRect().left < threshold) {
    // Scroll left if dragged near the left edge
    container.scrollLeft -= scrollSpeed;
  } else if (
    container.getBoundingClientRect().right - event.clientX <
    threshold
  ) {
    // Scroll right if dragged near the right edge
    container.scrollLeft += scrollSpeed;
  }
};

const storedColumnsOriginalData = computed(() => globalStore.localStorageCopy?.mainData || []);
watch(storedColumnsOriginalData, (newValue) => {
  const mainData = newValue || [];
  columnsOriginalData.value = mainData;
}, { immediate: true });


const updateAllColumnTasks = (updatedColumnData) => {
  // updates both localStorage & Pinia data
  useLocalStorage({ type: "set", key: "mainData", value: updatedColumnData });
};

const onEditColumnClick = (item) => {
  editColumnItemData.value = item;
  changeEditColumnModalState(true);
}

const onDeleteColumnClick = (item) => {
  openConfirmationDialog({ title: t('confirmations.delete', { title: item[nameKey.value] }), callbackFunc: () => globalStore.deleteColumn(item), isDangerous: true, yesButtonTitle: t('yes'), noButtonTitle: t('no') });
}

const onStartPulling = () => {
  isPullingCard.value = true;
};

const onFinishPulling = () => {
  isPullingCard.value = false;
};

const openConfirmationDialog = ({ title, callbackFunc, isDangerous, yesButtonTitle, noButtonTitle }) => {
  confirmationDialogData.value = {
    title,
    isDangerous,
    yesButtonTitle,
    noButtonTitle,
    confirmedFunc: callbackFunc
  };
  confirmationDialogRef.value?.changeDialogState(true);
};

// Tasks management
const onEditTask = (itemToEdit, index) => {
  editTaskItemData.value = { data: itemToEdit, index };
  changeTaskEditorModalState(true);
};

const onDeleteItem = (itemToDelete, index) => {
  openConfirmationDialog({ title: t('confirmations.delete', { title: itemToDelete[nameKey.value] }), callbackFunc: () => globalStore.deleteTask({ item: itemToDelete, itemIndex: index }), isDangerous: true, yesButtonTitle: t('yes'), noButtonTitle: t('no') });
};

const onViewItem = (itemToView) => {
  viewItemData.value = itemToView;
  changeTaskViewerState(true);
};

// Columns management

const onMovingInSameColumn = () => {
  const updatedColumnsList = columnsOriginalData?.value;
  updateAllColumnTasks(updatedColumnsList);
};

const onMovingToAnotherColumn = (event, columnId) => {
  let updatedColumnsList = JSON.parse(JSON.stringify(columnsOriginalData?.value));
  const { newIndex } = event;
  // update the status according the to the move-to column
  const columnIndex = updatedColumnsList.findIndex(item => item.id == columnId);
  if (columnIndex >= 0) {
    updatedColumnsList[columnIndex].tasks[newIndex].status = columnId;
  }
  updateAllColumnTasks(updatedColumnsList);
};

const onTaskEditSubmission = (updatedItem) => {
  const editValueObject = editTaskItemData?.value || {};
  const itemIndex = editValueObject?.index;
  const oldColumnId = editValueObject?.data?.status;
  globalStore.editTask({ item: updatedItem, itemIndex, oldColumnId });
};

const onColumnSubmission = (item, type) => {
  if (type == 'add') {
    globalStore.addNewColumn(item);
  } else if (type == 'edit') {
    globalStore.editColumn(item);
  }
};

</script>

<style scoped>
.ghost {
  background-color: #ddd !important;
  opacity: 0.5 !important;
}
</style>
