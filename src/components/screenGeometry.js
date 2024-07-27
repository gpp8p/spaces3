import { ref } from "vue";

export function screenGeometry(){
//    debugger;
    const thisScreenDims =  ref({});
    debugger;
    thisScreenDims.screenWidth = screen.width;
    thisScreenDims.screenHeight = screen.height;
    thisScreenDims.windowWidth = window.innerWidth;
    thisScreenDims.windowHeight = window.innerHeight;
    thisScreenDims.availableWidth = screen.availWidth;
    thisScreenDims.availableHeight = screen.availHeight;



    function refreshDims(){
        thisScreenDims.screenWidth = screen.width;
        thisScreenDims.screenHeight = screen.height;
        thisScreenDims.windowWidth = window.innerWidth;
        thisScreenDims.windowHeight = window.innerHeight;
        thisScreenDims.availableWidth = screen.availWidth;
        thisScreenDims.availableHeight = screen.availHeight;
        return thisScreenDims;
    }

//    console.log('thisScreenDims', thisScreenDims);
//    const rdims = ref(refreshDims());

    return {refreshDims, thisScreenDims};

}
