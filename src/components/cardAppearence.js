import {c} from "../components/constants.js";
import {getLogin} from "./login.js";
import {defineEmits, toRaw} from 'vue'
import {getTrans} from "./dbTrans.js";
import {ref} from 'vue';
import { useAsyncState, whenever } from '@vueuse/core'
import {createPinia, storeToRefs} from "pinia";
import {useLogStateStore} from "../stores/logState.js";
import {useCurrentPage} from "../stores/currentPage.js";

export function getAppearanceConfigs(){
    const loadAppearanceConfigs = function(){

    }
    const saveAppearanceConfigs = function(){

    }

    return {loadAppearanceConfigs, saveAppearanceConfigs}
}
