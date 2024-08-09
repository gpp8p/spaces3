import { ref } from 'vue';
import axios from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'
import { useAsyncState, whenever } from '@vueuse/core'
//import {useLoginStateStore} from '../stores/loginState.js';
//import { storeToRefs } from 'pinia';


export function getLogin(){
    const doLogin = function(userId, password, emit, c){
        const { execute, data, isFinished } = useAxios('http://localhost:8000/api/auth/login?XDEBUG_SESSION_START=14427', { method: 'POST' }, { immediate: false })
//        const store = useLoginStateStore();
//        const {structure, setStructure} = storeToRefs(store);
        debugger;
        data.value='';
        execute(
            { params: {
                    email: userId,
                    password: password,
                    default_org: 'root'
                },
                headers: {hdr1: 'header1'}
            });


        whenever(isFinished, () => {
            debugger;
            console.log('returned-', data._rawValue);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data._rawValue.access_token}`;
            const loginResults = ref(data._rawValue);
//            store.setStructure(loginResults);
            emit('cevt',[c.LOGIN_RETURNED, data._rawValue])
//            rslt.value = data.value;
        });


    }
    return {doLogin}
}
