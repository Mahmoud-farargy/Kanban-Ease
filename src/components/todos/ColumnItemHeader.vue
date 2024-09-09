<template>
    <div class="flex items-center gap-1 p-1">
        <span class="flex-1 flex items-center gap-2">
            <span class="text-lg text-light-text dark:text-dark-text ellipsis-x1"> {{ props.itemTitle }}</span>
            <span class="text-light-textSecondary dark:text-dark-textSecondary text-sm" >({{
                props.columnTasksCount
            }})</span>  
        </span>
        <span ref="dropdownRef" class="flex justify-self-end gap-2">
            <div class="relative inline-block text-left">
                <!-- Three dots button -->
                <button @click="toggleDropdown" class="text-gray-600 dark:text-gray-300 p-1 dark:hover:text-gray-200 hover:text-gray-900 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24"><path fill="currentColor" d="M16 12a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2"/></svg>
                </button>
                <!-- Dropdown menu -->
                <div v-if="showDropdown"
                    class="absolute z-10 right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <ul class="py-1">
                        <li @click="() => {toggleDropdown(); onEditColumnClick(props.column)}" class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            {{ $t('edit') }}
                        </li>
                        <li :disabled="props.column.isEssential" @click="() => {toggleDropdown(); onDeleteColumnClick(props.column)}" :class="`${props.column.isEssential ? 'disabled' : ''} px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer`.trim()">
                            {{ $t('delete')}}
                        </li>
                    </ul>
                </div>
            </div>
        </span>

    </div>
</template>

<script setup>
    import { ref, defineProps, onMounted, onUnmounted } from "vue";
    const showDropdown = ref(false);
    const dropdownRef = ref(null);

    const props = defineProps({
        itemTitle: {
            type: String,
            default: '',
            required: true
        },
        columnTasksCount: {
            type: Number,
            default: 0,
            required: true
        },
        onEditColumnClick: {
            type: Function,
            default: true,
        },
        onDeleteColumnClick: {
            type: Function,
            default: true,
        },
        column: {
            type: Object,
            required: true,
            default: () => ({})
        }
    })

    const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
    };

    // Close dropdown when clicked outside
    const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        showDropdown.value = false;
    }
    };

    onMounted(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onUnmounted(() => {
        document.removeEventListener('click', handleClickOutside);
    });
</script>