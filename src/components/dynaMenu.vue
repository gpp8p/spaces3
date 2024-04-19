
<template>
  <div :class="menuConfig.twStyling" >
    <dynamicMenu :config="menuConfig" @cevt="handleInput" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import dynamicMenu from './dynamicMenu.vue';
import menuItem from './menuItem.vue';
import menuItemDrop from '../components//menuItemDrop.vue';
import {c} from '../components/constants.js';
import {getMenu} from '../components/menuOpts.js';

export default defineComponent({
  components: {
    dynamicMenu,
    menuItem,
    menuItemDrop
  },
  props: ['menuOption'],
  setup(props) {
    console.log('props-',props.menuOption);
    debugger;
    const {getMenuOpts} = getMenu();
    const menuConfig = getMenuOpts(c, props.menuOption);
    console.log('menuConfig-', menuConfig);
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
