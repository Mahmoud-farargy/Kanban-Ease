<template>
    <transition name="dropdown">
        <!-- change status confirmation dialog -->
        <div @click.self="() => onDialogClose(false)" v-if="!!isDialogOpen" :aria-modal="true" tabindex="-1"
                class="overflow-y-auto overflow-x-hidden bg-gray-900/50 dark:bg-gray-900/80 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-lvh min:h-[100vh] max-h-full flex">
                 <!-- Modal content -->
                <div id="dialogContent" class="relative p-4 w-full max-w-xl max-h-full">
                    <div class="relative bg-white rounded-lg modal_inner_dialog">
                        <button @click="() => changeDialogState(false)" type="button"
                            class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                            <TimesIcon />
                            <span class="sr-only">Close modal</span>
                        </button>
                        <div class="p-6 text-center">
                            <!-- body -->
                            <svg aria-hidden="true" class="mx-auto mb-4 text-gray-400 w-14 h-14" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 class="mb-5 text-lg font-normal text-gray-500">
                                {{ confirmationDialogData.title }}
                            </h3>
                            <!-- action buttons -->
                            <div class="flex justify-center items-center gap-2">
                                <!-- yes -->
                                <button :disabled="isLoading" @click="() => {
                confirmationDialogData.confirmedFunc();
                changeDialogState(false);
            }
            " type="button"
                                    :class="`${isLoading ? 'disabled' : ''} ${confirmationDialogData.isDangerous
                ? 'bg-red-600 hover:bg-red-800 focus:ring-red-300 text-white'
                : 'bg-white hover:bg-gray-100 hover:text-gray-900 text-primary border-gray-200 '
            } border focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2`">
                                    {{
            confirmationDialogData.yesButtonTitle || $t("general.yes")
        }}
                                </button>
                                <!-- no -->
                                <button :disabled="isLoading" @click="() => changeDialogState(false)" type="button"
                                    :class="`${isLoading ? 'disabled' : ''
            } text-primary bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10`">
                                    {{ confirmationDialogData.noButtonTitle || $t("general.no") }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </transition>
</template>

<script>
import TimesIcon from "@/components/generic/icons/Times.vue";
// I am using optional API here to differentiate but I can convert it unti a composition component easily
export default {
    name: "ConfirmationDialog",
    data() {
        return {
            isDialogOpen: false,
        }
    },
    components:{
        TimesIcon
    },
    props: {
        isLoading: {
            type: Boolean,
            required: false,
            default: false,
        },
        confirmationDialogData: {
            type: Object,
            required: true,
            default: {
                title: "",
                isDangerous: false,
                yesButtonTitle: () => this.$t("general.yes"),
                noButtonTitle: () => this.$t("general.no"),
                confirmedFunc: () => { },
            },
        },
    },
    methods: {
        changeDialogState(newValue) {
            const isOpen = typeof newValue === "boolean" ? newValue : !this.isDialogOpen;
            this.isDialogOpen = isOpen;
        },
        onDialogClose(event) {
            const modalElement = document.getElementById("dialogContent");
            // Close modal if clicked outside the modal content (dialogContent)
            if (!modalElement?.contains(event.target)) {
                this.changeDialogState?.(false);
            }
        }
    }
};
</script>
