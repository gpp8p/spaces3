import { ref } from 'vue';
import axios from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'
import { useAsyncState, whenever } from '@vueuse/core'


export function getTrans(){
    const executeTrans = function(transParams, transId, transUrl, transMethod, emit, c, header, dataReady, transResult){
        const { execute, data, isFinished } = useAxios(transUrl, { method: transMethod }, { immediate: false })
        debugger;
        data.value='';
        execute(
            { params: transParams,
                headers: {hdr1: 'header1'}
            });


        whenever(isFinished, () => {
            debugger;
            console.log('returned-', transId, data._rawValue);
            const loginResults = ref(data._rawValue);
            axios.defaults.headers.common['Authorization'] = `Bearer ${loginResults.access_token}`;
            dataReady.value=true;
            transResult.value = data._rawValue;
//            emit('cevt',[c.TRANSACTION_COMPLETED, transId, data._rawValue])

        });


    }
    return {executeTrans}
}
