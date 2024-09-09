<template>
    <transition name="dropdown">
        <!-- Main modal -->
        <div @click="onModalClose" id="authentication-modal" v-if="!!isOpen" tabindex="-1" :aria-modal="true"
            aria-hidden="true"
            class="overflow-y-auto overflow-x-hidden bg-gray-900/50 dark:bg-gray-900/80 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-lvh min:h-[100vh] max-h-full flex">
            <!-- Modal content -->
            <div id="modalContent" class="relative p-4 w-full max-w-xl max-h-full">
                <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <!-- Modal header -->
                    <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                            {{ modalTitle }}
                        </h3>
                        <button type="button" @click="() => changeModalState(false)"
                            class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="authentication-modal">
                            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span class="sr-only">Close modal</span>
                        </button>
                    </div>
                    <!-- Modal body -->
                    <div class="overflow-x-hidden overflow-y-auto">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import timesIcon from "@/assets/icons/times.svg";
// I am using optional API here to differentiate but I can convert it unti a composition component easily
export default {
    data() {
        return {
            timesIcon,
        };
    },
    props: {
        changeModalState: {
            type: Function,
            required: true,
        },
        isOpen: {
            type: Boolean,
            default: false,
            required: true,
        },
        modalTitle: {
            type: String,
            default: "",
            required: true,
        }
    },
    methods: {
        onModalClose(event) {
            const modalElement = document.getElementById("modalContent");
            // Close modal if clicked outside the modal content (modalContent)
            if (!modalElement?.contains(event.target)) {
                this.changeModalState?.(false);
            }
        }
    },
    watch: {
        isOpen(val) {
            if (typeof val === 'boolean') {
                // disables the body scrolling effect when opened and returns it to normal when closed
                if (val) {
                    document.body.style.overflowY = "hidden";
                } else {
                    document.body.style.overflowY = "visible";
                }

            }
        }
    }
};
</script>

<style scoped></style>
