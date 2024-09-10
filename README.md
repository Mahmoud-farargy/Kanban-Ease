# namaa-advanced-todo

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

ToDos: Things that are supposed to be done but I don't have enough time for them:
- Put each svg icon in a separate component
- Add meta tags for better SEO performance
- Remove the description key and Add description_ar & description_en to the tasks so the user don't get confused when they switch to another languages and see the same description not being updated
- Globalize a function that can get the name_ar, name_en, and similar keys in a mixin so it be accessed anywhere instead of prop drilling the nameKey computed variable in some components.



How does the columns' data sync?
- On drag and drop change:
Update the localStorage, and Pinia state with each change

- On refresh:
When the app mounts (in App.vue) -- check if the localStorage has any stored data. If there is, add it to Pinia Storage
Before this component mounts (in TodosOrganizer.vue) -- check that pinia has tasks data, if there is, update the component state with it.

How to change the theme or language indirectly?
- On theme or language change:
Update the localStorage, and Pinia state with each change

- Listen for any change to the theme or language values in the localStorage (in App.vue) and handle the data accordingly. 