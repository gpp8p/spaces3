import { defineStore } from 'pinia'
import {ref} from 'vue';

export const useLoginStateStore = defineStore('loginState', () => {
    const structure = ref({});

    function setStructure(newStructure){
        debugger;
        structure.value = newStructure.value;
    }
    function getStructure() {
        return structure.value;
    }
    return {structure, setStructure, getStructure}
})
