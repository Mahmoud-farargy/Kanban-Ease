<template>
    <div
        v-if="props.item"
        :id="props.item.id"
        class="p-3 group sm:h-[6.3rem] rounded-[0.5rem] mb-[0.25rem] w-full border-[1px] relative border-light-taskBorder dark:border-dark-taskBorder shadow-[0_.0625rem_.125rem_rgba(0,0,0,.055)] hover:shadow-[0_.0625rem_.1875rem_rgba(0,0,0,.106),0_.0625rem_.125rem_-.0625rem_rgba(0,0,0,.106)] bg-light-white dark:bg-gray-600 min-h-[2.5rem] handle cursor-grab">
        <!-- task options -->
        <div v-if="!isPullingCard" class="sm:absolute p-1 group-hover:opacity-100 group-hover:pointer-events-auto opacity-100 pointer-events-auto sm:opacity-0 sm:pointer-events-none transition-opacity duration-100 flex items-center top-1.5 z-[10] max-h-[2rem] rtl:left-2 right-2 rtl:right-auto rounded-[0.375rem] mb-[0.25rem] w-max border-[1px] border-light-taskBorder dark:border-dark-taskBorder shadow-[0_.0625rem_.1875rem_rgba(0,0,0,.106),0_.0625rem_.125rem_-.0625rem_rgba(0,0,0,.106)] bg-light-white dark:bg-gray-600">
            <button @click.stop="emitEditAction" :tooltipTitle="$t('edit')" aria-label="Edit item" class="p-1 tooltip hover:bg-light-hover dark:hover:bg-dark-hover rounded-[0.375rem]"><EditIcon class="dark:text-gray-50" /></button>
            <button @click.stop="emitViewAction" :tooltipTitle="$t('view')" aria-label="View item" class="p-1 tooltip hover:bg-light-hover dark:hover:bg-dark-hover rounded-[0.375rem]"><ViewIcon class="dark:text-gray-50" /></button>
            <button @click.stop="emitDeleteAction" :tooltipTitle="$t('delete')" aria-label="Delete item" class="p-1 tooltip hover:bg-light-hover dark:hover:bg-dark-hover rounded-[0.375rem]"><DeleteIcon class="dark:text-gray-50" /></button>
        </div>
        <!-- task title -->
        <div class="flex flex-nowrap gap-1 justify-between text-light-text dark:text-white">
            <span class="ellipsis-x1 mb-1 flex-1">{{ props.item[props.nameKey] }}</span>
        </div>
        <!-- task description -->
        <p class="line-clamp-2 text-light-text dark:text-dark-text text-sm mb-2" :title="props.item.description">{{ props.item.description }}</p>
        <!-- priority & due date -->
        <div class="flex justify-end gap-2">
            <span class="inline-flex gap-1 items-center border border-light-taskBorder dark:border-dark-taskBorder rounded-md py-0.5 p-1">
                <svg class="dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 36 36"><path fill="currentColor" d="M32.25 6H29v2h3v22H4V8h3V6H3.75A1.78 1.78 0 0 0 2 7.81v22.38A1.78 1.78 0 0 0 3.75 32h28.5A1.78 1.78 0 0 0 34 30.19V7.81A1.78 1.78 0 0 0 32.25 6" class="clr-i-outline clr-i-outline-path-1"/><path fill="currentColor" d="M8 14h2v2H8z" class="clr-i-outline clr-i-outline-path-2"/><path fill="currentColor" d="M14 14h2v2h-2z" class="clr-i-outline clr-i-outline-path-3"/><path fill="currentColor" d="M20 14h2v2h-2z" class="clr-i-outline clr-i-outline-path-4"/><path fill="currentColor" d="M26 14h2v2h-2z" class="clr-i-outline clr-i-outline-path-5"/><path fill="currentColor" d="M8 19h2v2H8z" class="clr-i-outline clr-i-outline-path-6"/><path fill="currentColor" d="M14 19h2v2h-2z" class="clr-i-outline clr-i-outline-path-7"/><path fill="currentColor" d="M20 19h2v2h-2z" class="clr-i-outline clr-i-outline-path-8"/><path fill="currentColor" d="M26 19h2v2h-2z" class="clr-i-outline clr-i-outline-path-9"/><path fill="currentColor" d="M8 24h2v2H8z" class="clr-i-outline clr-i-outline-path-10"/><path fill="currentColor" d="M14 24h2v2h-2z" class="clr-i-outline clr-i-outline-path-11"/><path fill="currentColor" d="M20 24h2v2h-2z" class="clr-i-outline clr-i-outline-path-12"/><path fill="currentColor" d="M26 24h2v2h-2z" class="clr-i-outline clr-i-outline-path-13"/><path fill="currentColor" d="M10 10a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1" class="clr-i-outline clr-i-outline-path-14"/><path fill="currentColor" d="M26 10a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1" class="clr-i-outline clr-i-outline-path-15"/><path fill="currentColor" d="M13 6h10v2H13z" class="clr-i-outline clr-i-outline-path-16"/><path fill="none" d="M0 0h36v36H0z"/></svg>
                <span class="text-xs" :class="computedDueDateColorClass"  :title="props.item.due_date">{{ computedFormatedDate }}</span> 
            </span>
            <span class="inline-flex gap-1 items-center border border-light-taskBorder dark:border-dark-taskBorder rounded-md py-0.5 px-1">
                <svg xmlns="http://www.w3.org/2000/svg" :class="computedPriorityColorClass" width="17" height="17" viewBox="0 0 1024 1024"><path fill="currentColor" d="M288 128h608L736 384l160 256H288v320h-96V64h96z"/></svg>
                <span class="text-xs capitalize dark:text-gray-300" :title="props.item.priority_level">{{ props.item.priority_level }}</span>
            </span>
        </div>


    </div>
</template>

<script setup>
    import moment from "moment-timezone";
    import '@/helpers/moment-locales/ar';
    import { EditIcon, ViewIcon, DeleteIcon } from "@/components/generic";
    import { defineProps, defineEmits, computed } from "vue";
    import { lowerString } from "@/helpers";

    const emit = defineEmits();
    const props = defineProps({
        item: {
            type: Object,
            default: () => ({}),
            required: true
        },
        index: {
            type: Number,
            default: -1,
            required: true
        },
        nameKey: {
            type: String,
            default: 'name_en',
            required: true
        },
        currentLanguage: {
            type: String,
            default: 'en',
            required: true
        },
        isPullingCard: {
            type: Boolean,
            default: false,
            required: false
        }
    });

    const computedFormatedDate = computed(() =>{
        const { due_date } = props.item || {};
        const now = moment();
        const inputDate = moment(due_date).locale(props.currentLanguage);

        if (inputDate.isSame(now, 'day')) {
            const diffInMinutes = inputDate.diff(now, 'minutes');
            if (diffInMinutes < 120 && diffInMinutes >= 0) { // 120 minutes = 2 hours
            const hours = Math.floor(diffInMinutes / 60);
            const minutes = diffInMinutes % 60;
            if (hours > 0) {
                return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''} left`;
            } else {
                return `${minutes} minute${minutes !== 1 ? 's' : ''} left`;
            }
            } else {
            return inputDate.format('h:mm A'); // Show only the time
            }
        } else if (inputDate.isSame(now, 'week')) {
            // If within this week, show day of the week and time
            return inputDate.format('ddd h:mm A');
        } else if (inputDate.isSame(now, 'year')) {
            // If within this year, show month and date
            return inputDate.format('MMM D');
        } else {
            // If more than a year ago, show full date
            return inputDate.format('DD/MM/YY');
        }
    });

    const computedPriorityColorClass = computed(() => {
        // change the text color according to the priority
        const { priority_level } = props.item || {};
        switch(lowerString(priority_level)){
            case 'low':
                return 'text-gray-700 text-gray-500';
            case 'medium':
                return 'text-blue-700 text-blue-500';
            case 'high':
                return 'text-yellow-700 text-yellow-500';
            case 'urgent':
                return 'text-red-700 text-red-500';
            default:
                return '';
        }
    });

    const computedDueDateColorClass = computed(() => {
        // change the text color according to the due-date
        const { due_date, status } = props.item || {};
        const now = moment();
        const inputDate = moment(due_date);
        const hasDatePassed = inputDate.isBefore(now);

        if(hasDatePassed){
            // passed and done
            if(status === 'done'){
                return "text-green-700 dark:text-green-500";
            }else {
            // passed and not done yet
                return "text-red-700 dark:text-red-500";
            }
        }else{
            // date is in the future still
            return "text-gray-700 dark:text-gray-300"
        }

    });

    const emitEditAction = () => {
        emit("onEditItem", props.item || {}, props.index);
    }

    const emitViewAction = () => {
        emit("onViewItem", props.item || {}, props.index);
    }

    const emitDeleteAction = () => {
        emit("onDeleteItem", props.item || {}, props.index);
    }
</script>
