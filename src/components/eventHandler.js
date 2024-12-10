import { ref } from "vue";

export function useEventHandler() {
    const handleEvent = function(evt, funcs, emit){
 //       debugger;
 //       console.log('event-', evt);
        if(typeof(funcs[evt[0]])!='undefined'){
            funcs[evt[0]](evt);
        }else{
            emit('cevt', evt);
        }
    }
    return {handleEvent};
}
