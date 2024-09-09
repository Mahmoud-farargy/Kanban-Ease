import { createRouter, createWebHistory } from 'vue-router';
import TodosOrganizer from "@/views/pages/TodosOrganizer.vue";

const routes = [
    // ---- Main page - Todos Organizer -----
    {
        path: "/",
        name: 'Home',
        component: TodosOrganizer
    },
      // ---- 404 Not Found Page----
    {
        component: () => import('@/views/pages/errors/_404.vue'),
        path: "/:catchAll(.*)"
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: function(to, _, savedPosition){
      // if hashtag found, scroll the user to the section that has this id if found in the URL
      if(to.hash){
          const element = document.getElementById(to.hash.replace(/#/, ''))
            if (element && element.scrollIntoView) {
              element.scrollIntoView({block: 'center', behavior: 'smooth'});
            }
          return {
            el: to.hash
          }
      }else if(savedPosition){
        // when going back to a previous page, scroll to the exact same position they were in
        return savedPosition;
      }else{
        // otherwise, when opening any page, scroll them to the very top
        return { top: 0 };
      }
    },
  })

export default router;