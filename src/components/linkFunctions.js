import {c} from "../components/constants.js";
import {getLogin} from "./login.js";
import {defineEmits, toRaw} from 'vue'
import {getTrans} from "./dbTrans.js";
import {ref} from 'vue';
import { useAsyncState, whenever } from '@vueuse/core'
import {createPinia, storeToRefs} from "pinia";
import {useLogStateStore} from "../stores/logState.js";
import {useCurrentPage} from "../stores/currentPage.js";
const emit = defineEmits(['cevt']);

export function getLinkFunctions(){
    const addNewLink = function (selectedLayout,cardInstanceId,  layoutId, description, menuLabel){
        const {executeTrans} = getTrans();
        const loginStore = useLogStateStore();
        const loginResult= toRaw(loginStore.loginStatus);
        const header = loginResult.access_token;
        const dataReady = ref(false);
        const transResult = ref({});
        const parms = {
            card_instance_id: cardInstanceId,
            org_id: loginResult.org_id,
            layout_id: layoutId,
            description: description,
            layout_link_to: selectedLayout
        }
        executeTrans(parms, c.ALL_PAGES,  c.API_PATH+'api/shan/addNewLink?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
        whenever(dataReady, () => {
            debugger;
//          try a call to getLinks here or just notify that insert has been successful ???



            emit('cevt', [c.FIELD_CHANGED, 'currentLinks', toRaw(dataToShow.value)]);
            debugger;

        })
    }
    const getLinks = function(cardInstanceId){
        debugger;
        const {executeTrans} = getTrans();

        const loginResult= toRaw(loginStore.loginStatus);
        const header = loginResult.access_token;
        const dataReady = ref(false);
        const transResult = ref({});
        const parms = {
            cardId:cardInstanceId,
        }
        executeTrans(parms, c.ALL_PAGES,  c.API_PATH+'api/shan/getLinks?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
        whenever(dataReady, () => {
            debugger;
            console.log('fundReadAllData completed-', transResult._rawValue, currentTableConfig);
            dataToShow.value = transResult._rawValue;
            currentTableConfig.value.rowsToShow = dataToShow.value.length;
            console.log('dataToShow.length',dataToShow.value.length, toRaw(dataToShow.value));
            emit('cevt', [c.FIELD_CHANGED, 'currentLinks', toRaw(dataToShow.value)]);
            debugger;

        })
    }
    const deleteLink = function(linkId){

    }
    return {addNewLink, getLinks, deleteLink}
}
