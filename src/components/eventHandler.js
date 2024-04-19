import { ref } from "vue";

export function useEventHandler() {
    const handleEvent = function(evt, funcs, emit){
        debugger;
        if(typeof(funcs[evt[0]])!='undefined'){
            funcs[evt[0]](evt);
        }else{
            emit('cevt', evt);
        }
    }
    return {handleEvent};
}
