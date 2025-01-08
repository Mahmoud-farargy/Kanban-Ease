<template>
    <!-- Modals -->
    <Modal :isOpen="isColumnModalOpen" :changeModalState="props.changeColumnModalState" :modalTitle="modalTitle">
        <!-- Modal body -->
        <form @submit.prevent="onColumnSubmission">
            <!-- modal form -->
            <div class="space-y-4 p-4 md:p-5">
                <!-- Name in English -->
                <div>
                    <label for="name_en" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{
        $t("form_labels.name_in_english") }}
                        <strong class="text-red-500">*</strong>
                    </label>
                    <input v-model="columnform.name_en" type="text" name="name_en" id="name_en"
                        class="bg-gray-50 outline-lime-500 transition-colors duration-150 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                    <input v-model="columnform.name_ar" type="text" name="name_ar" id="name_ar"
                        class="bg-gray-50 outline-lime-500 transition-colors duration-150 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
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
                <!-- Color -->
                <div>
                    <label for="color" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {{ $t("form_labels.color") }}
                        <strong class="text-red-500">*</strong>
                    </label>
                    <input v-model="columnform.color" type="color" name="color" id="color"
                        class="bg-gray-50 outline-lime-500 transition-colors duration-150 border border-gray-300 min-h-[2.620rem] text-gray-900 text-sm overflow-hidden rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-1 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                    <!-- error -->
                    <div v-if="v$ && v$.color && v$.color.$errors">
                        <p v-for="error of v$.color.$errors" :key="error.$uid"
                            class="error_message p-4 mb-4 flex flex-column text-sm mt-2 text-red-800 rounded-lg bg-red-50"
                            role="alert">
                            {{ error.$message }}
                        </p>
                    </div>
                </div>
                <!-- Order -->
                <div>
                    <label for="order" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {{ $t("form_labels.order") }}
                        <span class="text-gray-500 dark:text-gray-200 text-xs font-normal">{{ $t('optional') }}</span>
                    </label>
                    <input v-model="columnform.order" type="number" :min="1" :max="memoizedMaxNumber" name="order"
                        id="order"
                        class="bg-gray-50 outline-lime-500 transition-colors duration-150 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                    <!-- error -->
                    <div v-if="v$ && v$.order && v$.order.$errors">
                        <p v-for="error of v$.order.$errors" :key="error.$uid"
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
                <button @click="() => props.changeColumnModalState(false)" type="button"
                    class="text-primary bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary/20 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2 hover:text-primary/90 focus:z-10">
                    {{ $t("cancel") }}
                </button>
            </div>
        </form>
    </Modal>
</template>

<script setup>
import { ref, computed, watch } from "vue";
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
    isColumnModalOpen: {
        type: Boolean,
        required: true,
        default: false,
    },
    changeColumnModalState: {
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
    currentColumnsLength: {
        type: Number,
        required: true,
        default: 1
    }
});

const columnform = ref({
    name_en: "",
    name_ar: "",
    color: "",
    order: "",
});

const rules = {
    name_en: {
        ...VALIDATIONS.name,
    },
    name_ar: {
        ...VALIDATIONS.name,
    },
    color: {
        ...VALIDATIONS.requiredInput,
    },
    order: { //optional
        ...VALIDATIONS.order,
    },
};
const v$ = useVuelidate(rules, columnform);

const minDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 16);
};

const modalTitle = computed(() => {
    return props.operationType == "edit"
        ? t("edit_column", { columnName: props.editItemData[props.nameKey] })
        : t("add_column");
});

const memoizedMaxNumber = computed(() => {
    return props.operationType === 'add' ? props.currentColumnsLength + 1 : props.currentColumnsLength
})

const resetFormDataAndValidation = () => {
    Object.keys(columnform.value || {}).forEach(
        (key) => (columnform.value[key] = key === 'order' ? 1 : "")
    );
    v$.value.$reset();
};

const computedColumnModalState = computed(() => props.isColumnModalOpen);
watch(computedColumnModalState, (isOpen) => {
    const isBool = typeof isOpen === "boolean";
    const isClosed = !isOpen;
    const isAdd = props.operationType !== "edit";

    if (isBool && isClosed && isAdd) {
        resetFormDataAndValidation();
    }
});

const onColumnSubmission = () => {
    v$.value.$touch(); // Mark all fields as touched
    if (v$.value.$invalid) {
        return;
    }

    let dataToSubmit = {
        ...(props.operationType === "add" ? {
            // generate an id when adding a new column
            id: generateRandomId(),
            tasks: []
        } : {
            ...props.editItemData
        }),
        ...columnform.value,
    };
    // emits the onSubmission event to the parent
    emit("onSubmission", dataToSubmit, props.operationType);
    // closes the modal
    props.changeColumnModalState(false);
};

const memoizedEditData = computed(() => props.editItemData);
watch(
    memoizedEditData,
    (editItem = {}) => {
        if (props.operationType === "edit") {
            // Auto-populate the editItemData object to the form inputs if a case of editing and the modal is open
            Object.entries(editItem).forEach(([key, value]) => {
                if (key in columnform.value) {
                    columnform.value[key] = value || "";
                }
            });
        }
    },
    { flush: "post" }
);
</script>