import { defineStore } from 'pinia'
import {ref} from 'vue';

export const useLoginStateStore = defineStore('loginState', () => {
    const structure = ref({});

    function setStructure(newStructure){
        debugger;
        structure.value = newStructure.value;
    }
    return {structure, setStructure}
})
