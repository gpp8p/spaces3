<template>
  <div class="border-4 my-10 w-3/4 mx-auto border-blue-200" >
    <dynamicMenu :config="menuConfig" @input="handleInput" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import dynamicMenu from './dynamicMenu.vue';
import menuItem from './menuItem.vue';
//import htmlTextInput from './htmlTextInput.vue';
import menuItemDrop from '../components//menuItemDrop.vue';

export default defineComponent({
  components: {
    dynamicMenu,
    menuItem,
    menuItemDrop
//    htmlTextInput,
  },
  setup() {
    const menuConfig = {
      items: [
        { type: 'menuItem', config: { label: 'Home', actionCode: 'act_home' } },
//        { type: 'htmlTextInput', config: { name: 'search', placeholder: 'Search...' } },
        { type: 'menuItemDrop', config: {label: 'Drop', subItems: [ { subLabel: 'Option 1', actionCode: 'OPTION_1' },
                                                                    { subLabel: 'Option 2', actionCode: 'OPTION_2' },
                                                                    { subLabel: 'Option 3', actionCode: 'OPTION_3' }
                                                                   ]
                                        }
        },
        { type: 'menuItem', config: { label: 'About', actionCode: 'act_about' } },
        { type: 'menuItem', config: { label: 'Contact', actionCode: 'act_contact' } },
      ],
    };

    const handleInput = (data) => {
      console.log('Input received:', data);
    };

    return {
      menuConfig,
      handleInput,
    };
  },
});
</script>
