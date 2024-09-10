<template>
    <header
        class="sm:sticky top-0 left-0 sm:z-30 md:h-[var(--header-height-desktop)] bg-white dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-600 py-4 px-5 sm:px-7 mb-4 xl:mb-[var(--header-margin-bottom-desktop)]">
        <!-- Add modal -->
        <AddEditTaskModal :nameKey="nameKey" operationType="add" :isTaskModalOpen="isTaskModalOpen"
            :changeTaskModalState="changeTaskModalState" @onSubmission="onTaskAddSubmission" />
        <div class="flex flex-col gap-2 sm:flex-row">
            <div
                class="flex gap-3 sm:flex-1 md:gap-3.5 lg:gap-4 flex-col-reverse sm:flex-row sm:flex-nowrap sm:items-center">
                <!-- Buttons -->
                <!-- Add new task button -->
                <div class="flex gap-3 sm:flex-1 md:gap-3.5 lg:gap-4 flex-col sm:flex-row sm:flex-nowrap items-baseline sm:items-center">
                    <button @click="openTaskAddModal"
                        class="relative inline-flex flex-nowrap whitespace-nowrap items-center w-full sm:max-w-max justify-center p-0.5 text-sm font-medium text-gray-900 rounded-lg group dark:text-white primary-button-bg"
                        :aria-label="$t('add_task')">
                        <span
                            class="flex items-center w-full gap-1 relative px-3 py-1.5 md:py-2 md:px-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            <AddIcon size="19" />
                            <span>{{ $t("add_task") }}</span>
                        </span>
                    </button>

                    <!-- Add new cioumn button -->
                    <button @click="changeAddColumnModalState"
                        class="relative inline-flex flex-nowrap whitespace-nowrap items-center w-full sm:max-w-max justify-center p-0.5 text-sm font-medium text-gray-900 rounded-lg group dark:text-white primary-button-bg"
                        :aria-label="$t('add_column')">
                        <span
                            class="flex items-center w-full gap-1 relative px-3 py-1.5 md:py-2 md:px-4 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            <AddIcon size="19" />
                            <span>{{ $t("add_column") }}</span>
                        </span>
                    </button>
                    <!-- Sort tasks in each column by priority level -->
                    <button  @click="sortTasksByPriority" :tooltipTitle="$t('button_titles.sort_tasks_by_priority')" class="relative tooltip inline-flex items-center sm:max-w-max justify-center p-2 text-sm font-medium text-gray-900 rounded-full group bg-gray-200 active:scale-95 dark:bg-gray-500 dark:text-white hover:brightness-95 transition-[filter,transform] duration-150"
                        :aria-label="$t('button_titles.sort_tasks_by_priority')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M14 19h8v-2h-8zm0-5.5h8v-2h-8zM14 8h8V6h-8zM2 12.5C2 8.92 4.92 6 8.5 6H9V4l3 3l-3 3V8h-.5C6 8 4 10 4 12.5S6 17 8.5 17H12v2H8.5C4.92 19 2 16.08 2 12.5"/></svg>
                    </button>
                </div>



                <!-- Search bar -->
                <form class=" w-full sm:max-w-sm" @submit.prevent>
                    <label for="default-search" class="text-sm font-medium text-gray-900 sr-only dark:text-white">{{
            $t("search") }}</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-2.5 sm:ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </div>
                        <input type="search" id="default-search" v-model="seachValue"
                            class="block outline-none w-full min-h-[2.560rem] py-1 md:py-1.5 rtl:pr-7 pl-7 rtl:sm:pr-9 rtl:sm:pl-0 sm:pl-9 pr-0 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-lime-500 focus:border-lime-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500"
                            :placeholder="$t('search_bar_placeholder')" required />
                        <button type="submit"
                            class="absolute end-1 bottom-1 bg-gray-200 active:scale-95 dark:bg-gray-500 dark:text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-1.5 hover:brightness-95 transition-[filter,transform] duration-150">
                            {{ $t("search") }}
                        </button>
                    </div>
                </form>
            </div>

            <div class="flex items-start sm:items-center gap-2 lg:gap-3 justify-self-end">
                <!-- Theme switcher -->
                <span>
                    <button v-if="isCurrentThemeDark" :aria-labelledby="$t('button_titles.light_theme')"
                        :tooltitleTitle="$t('button_titles.light_theme')" type="button" @click="() => switchTheme('light')"
                        class="hs-dark-mode tooltip font-medium text-gray-800 dark:text-lime-500 rounded-full dark:hover:bg-lime-50 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
                        data-hs-theme-click-value="dark">
                        <span class="group inline-flex shrink-0 justify-center items-center size-9">
                            <LightIcon />
                        </span>
                    </button>
                    <button v-else type="button" :aria-labelledby="$t('button_titles.dark_theme')"
                        :tooltipTitle="$t('button_titles.dark_theme')"  @click="() => switchTheme('dark')"
                        class="block tooltip hs-dark-mode font-medium text-gray-800 dark:text-lime-500 rounded-full dark:hover:bg-lime-50 hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
                        data-hs-theme-click-value="dark">
                        <span class="group inline-flex shrink-0 justify-center items-center size-9">
                            <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="35" height="35"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                            </svg>
                        </span>
                    </button>
                </span>
                <!-- Language switcher -->
                <button @click="toggleLanguage" :aria-labelledby="languageButtonTitle" :tooltipTitle="languageButtonTitle"
                    class="hs-dark-mode tooltip font-medium text-gray-800 dark:text-lime-500 dark:hover:bg-lime-50 rounded-full hover:bg-gray-200 focus:outline-none focus:bg-gray-200">
                    <span class="group inline-flex shrink-0 justify-center items-center size-9">
                        <svg class="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="35" height="35"
                            viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M14.022 7h1a1 1 0 0 1 1 1v1a1 1 0 0 0 2 0V8a3.003 3.003 0 0 0-3-3h-1a1 1 0 0 0 0 2m-4 9h-1a1 1 0 0 1-1-1v-1a1 1 0 0 0-2 0v1a3.003 3.003 0 0 0 3 3h1a1 1 0 0 0 0-2m11-1a1 1 0 0 0 0-2h-3v-.5a1 1 0 0 0-2 0v.5h-3a1 1 0 0 0 0 2h5.184a6.7 6.7 0 0 1-1.225 2.527a6.7 6.7 0 0 1-.63-.983a1 1 0 1 0-1.779.912a8.7 8.7 0 0 0 .96 1.468a6.6 6.6 0 0 1-2.426 1.099a1 1 0 0 0 .427 1.954a8.6 8.6 0 0 0 3.445-1.622a8.7 8.7 0 0 0 3.469 1.622a1 1 0 1 0 .43-1.954a6.7 6.7 0 0 1-2.446-1.09A8.74 8.74 0 0 0 20.244 15Zm-11.97-3.757a1 1 0 0 0 1.94-.486l-1.757-7.03a2.281 2.281 0 0 0-4.426 0l-1.757 7.03a1 1 0 0 0 1.94.486L5.552 9h2.94ZM6.052 7l.698-2.787a.291.291 0 0 1 .544 0L7.991 7Z" />
                        </svg>
                    </span>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { Modal, AddIcon, LightIcon } from "@/components/generic";
import { useGlobalStore } from "@/store/Modules/global";
import AddEditTaskModal from "@/components/todos/AddEditTaskModal.vue";
import { VALIDATIONS } from "@/helpers";

const globalStore = useGlobalStore();
const isTaskModalOpen = ref(false);

const props = defineProps({
    nameKey: {
        type: String,
        required: true,
        default: "name_en",
    },
    changeAddColumnModalState: {
        type: Function,
        required: true
    }
});

const seachValue = computed({
    // Two way binding directly with the global store
    get() {
        return globalStore?.getSearchValue;
    },
    set(val) {
        globalStore.updateSearchValue(val);
    },
});

const sortTasksByPriority = () => {
    globalStore?.sortTasksByPriority();
}

const isCurrentThemeDark = computed(() => globalStore?.getCurrentTheme);
const switchTheme = (modeType) => {
    globalStore?.changeTheme(!!(modeType === "dark"));
};

const currentLanguage = computed(() => globalStore?.getCurrentLanguage);
const toggleLanguage = () => {
    globalStore?.changeLanguage(currentLanguage.value === 'ar' ? 'en' : 'ar');
}

const languageButtonTitle = computed(() => (currentLanguage.value === 'en' ?  'Change language to Arabic' :'التغيير اللغة إلي الانجليزية ' ));

const changeTaskModalState = (newValue) => {
    const isOpen =
        typeof newValue === "boolean" ? newValue : !isTaskModalOpen.value;
    isTaskModalOpen.value = isOpen;
};

const onTaskAddSubmission = (newFormData) => {
    if (!newFormData) {
        return;
    }
    globalStore?.addNewTask(newFormData);
};

const openTaskAddModal = () => {
    changeTaskModalState(true);
};
</script>
