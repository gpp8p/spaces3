import { ref } from 'vue';
import axios from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'
import { useAsyncState, whenever } from '@vueuse/core'

export function getLogin(){
    const doLogin = function(userId, password){
        const { execute, data, isFinished } = useAxios('http://localhost:8000/api/auth/login?XDEBUG_SESSION_START=14427', { method: 'POST' }, { immediate: false })
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
            console.log('returned-', data._rawValue);
//            rslt.value = data.value;
        });


    }
    return {doLogin}
}
