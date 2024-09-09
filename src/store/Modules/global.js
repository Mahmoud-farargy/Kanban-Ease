import { defineStore } from "pinia";
import { useLocalStorage, localStorageBasicData } from "@/helpers";

export const useGlobalStore = defineStore("global", {
  state: () => {
    return {
      localStorageCopy: localStorageBasicData,
      searchValue: "",
    };
  },
  actions: {
    updateLocalStorageCopy(updatedData){
        this.localStorageCopy = updatedData;
    },
    updateSearchValue(newValue){
      this.searchValue = newValue;
    },
    changeTheme(isDarkMode){
      // updates both localStorage & Pinia data
      useLocalStorage({ type: "set", key: "isDarkMode", value: !!isDarkMode });
    },
    changeLanguage(newLanguage){
      // updates both localStorage & Pinia data
      useLocalStorage({ type: "set", key: "language", value: newLanguage });
    },
    addNewTask(newTaskData){
      if(!newTaskData){
        return;
      }
      // Create a deep copy of the columns data to avoid direct mutation
      let columnsList = JSON.parse(JSON.stringify(this.localStorageCopy?.mainData)) || [];
      const {status: columnId} = newTaskData || {};
      const columnIndex = columnsList.findIndex(item => item.id == columnId);
      
      if(columnIndex >=0){
        const columnTasks = columnsList[columnIndex].tasks;
        columnsList[columnIndex].tasks = [newTaskData,...columnTasks];
      }
      
      // updates both localStorage & Pinia data
      useLocalStorage({ type: "set", key: "mainData", value: columnsList });
    },
    editTask({item, itemIndex, oldColumnId}) {
      if(!item){
        return;
      }
      let columnsList = JSON.parse(JSON.stringify(this.localStorageCopy?.mainData)) || [];
      const {status: newColumnId, id: taskId } = item || {};

      const columnIndex = columnsList.findIndex(item => item.id == oldColumnId);

      function moveTaskToNewColumn() {
        const updatedColumnsData = columnsList;
        const oldColumn = updatedColumnsData.find(col => col.id == oldColumnId);
        const newColumn = updatedColumnsData.find(col => col.id == newColumnId);

        if (!oldColumn || !newColumn) {
          console.error('Invalid column IDs');
          return updatedColumnsData;
        }

        // Find and remove the task from the old column
        const taskIndex = oldColumn.tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) {
          console.error('Task not found in old column');
          return updatedColumnsData;
        }

        const [task] = oldColumn.tasks.splice(taskIndex, 1);

        // Add the task to the new column
        newColumn?.tasks.push(task);

        // Return the updated columns data
        return updatedColumnsData;
      }
      
      if(columnIndex >=0 && itemIndex >=0){
        // Update the task item with the edited data
        columnsList[columnIndex].tasks[itemIndex] = item;
      }

      // If the status has been changed, move the task from the old column to the new one
      const hasStatusChanged = newColumnId != oldColumnId;
      if(hasStatusChanged){
        columnsList = moveTaskToNewColumn({taskId, oldColumnId, newColumnId });
      }

      useLocalStorage({ type: "set", key: "mainData", value: columnsList });
    },
    deleteTask({item, itemIndex}){
      if(!item){
        return;
      }

      let columnsList = JSON.parse(JSON.stringify(this.localStorageCopy?.mainData)) || [];
      const {status: columnId} = item || {};
      const columnIndex = columnsList.findIndex(item => item.id == columnId);
      
      if(columnIndex >=0 && itemIndex >=0){
        columnsList[columnIndex].tasks.splice( itemIndex,1);     
        useLocalStorage({ type: "set", key: "mainData", value: columnsList });
      }
    },
    addNewColumn(newTaskData){
      console.log("newTaskData", newTaskData);
      if(!newTaskData){
        return;
      }

      let columnsList = JSON.parse(JSON.stringify(this.localStorageCopy?.mainData)) || [];
      columnsList.push(newTaskData);

      useLocalStorage({ type: "set", key: "mainData", value: columnsList });
    },
    editColumn(item){
      if(!item){
        return;
      }
      let columnsList = JSON.parse(JSON.stringify(this.localStorageCopy?.mainData)) || [];
      const columnIndex = columnsList.findIndex(column => column.id == item.id);
      if(columnIndex >=0){
        columnsList[columnIndex] = item;
        useLocalStorage({ type: "set", key: "mainData", value: columnsList });
      }
    },
    deleteColumn(item) {
      if(!item || item?.isEssential){
        return;
      }
      
      let columnsList = JSON.parse(JSON.stringify(this.localStorageCopy?.mainData)) || [];
      const columnIndex = columnsList.findIndex(column => column.id == item.id);
      
      if(columnIndex >=0){
        columnsList.splice(columnIndex, 1);
        useLocalStorage({ type: "set", key: "mainData", value: columnsList });
      }
    }
  },
  getters: {
    getColumnsData: (store) => (store.localStorageCopy?.mainData || []),
    getNameKey: (store)=> {
        // switches between name_ar & name_en based on the current language
        const isArabic = store.localStorageCopy?.language === 'ar';
        return `name_${isArabic ? 'ar' : 'en'}`;
    },
    getSearchValue: (store) => (store.searchValue || ''),
    getCurrentLanguage: (store) => (store.localStorageCopy?.language || 'en'),
    getCurrentTheme: (store) => (store.localStorageCopy?.isDarkMode),
  }
});
