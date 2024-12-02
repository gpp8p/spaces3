import {c} from "../components/constants.js";
import {getLogin} from "./login.js";
import {defineEmits, toRaw} from 'vue'
import {getTrans} from "./dbTrans.js";
import {ref} from 'vue';
import { useAsyncState, whenever } from '@vueuse/core'
import {createPinia, storeToRefs} from "pinia";
import {useLogStateStore} from "../stores/logState.js";
import {useCurrentPage} from "../stores/currentPage.js";
//import {getLoaders} from "../components/ltLoader.js";
//import {useLogStateStore} from "../stores/logState.js";
import {getAppearanceConfigs}  from "../components/cardAppearence.js";


export function getDialogDefinitions(){

    const getDialogAppearence = function(dialogDef){
        var currentDefs = defs(dialogDef);
//        debugger;
        return currentDefs.dialogAppearence;
    }
    const getDialogFields = function(dialogDef){
//        debugger;
        var currentDefs = defs(dialogDef);
        return currentDefs.dialogFields;
    }
    const getDefaultData = function(dialogDef){
        debugger;
        var currentDefs = defs(dialogDef);
        return currentDefs.defaultData;
    }
    const getDialogData = function(dialogDef){
        var currentDefs = defs(dialogDef);
        return currentDefs.dialogData;
    }
    const getMenuDefinitions = function(dialogDef){
        var currentDefs = defs(dialogDef);
        return currentDefs.menuDefs;
    }
    const getActions = function(dialogDef){
        var currentDefs = defs(dialogDef);
        return currentDefs.addActions
    }
    const getDialogParams = function(dialogDef, aspect){
        var currentDefinitions;
        switch(aspect){
            case 'fields': {
                currentDefinitions = defs(dialogDef);
                return currentDefinitions.dialogFields;
            }
            case 'defaultData': {
                currentDefinitions = defs(dialogDef);
                return currentDefinitions.defaultData;
            }
            case 'menu': {
                currentDefinitions = defs(dialogDef);
                return currentDefinitions.menuDefs;
            }
            case 'actions':{
                currentDefinitions = defs(dialogDef);
                return currentDefinitions.actions;
            }
        }
    }
    return {getDialogAppearence, getDialogFields, getDefaultData, getDialogData, getMenuDefinitions, getActions, getDialogParams}
}




/*
const existingData = {
    name: "Curious George",
    num: "7.5",
    city: "The Zoo",
    field4: true
}
*/


const defs = function(dialogDef){
//    debugger;
    switch(dialogDef){
        case 'pageSettings':{
            return {
                dialogAppearence: {
                    twPrompt: 'text-lg text-current ml-[30%] my-[5%]',
                    prompt: 'Test Dialog',
                    twstyle:"fixed w-[50%] h-auto p-[2%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded border-2 border-blue-500 shadow-xl shadow-black",
                },
                dialogFields :
                    [

                        {
                            name: 'pageName',
                            type: 'inputText',
                            ref: 'pageName',
                            value: function(existingData){
                                debugger;
                                return existingData.pageName;
                            },
                            required: true,
                            size: '25',
                            maxlength: '35',
                            startFocus: true,
                            label: "Page Name"
                        },
                        {
                            name: 'pageDescription',
                            type: 'vtextarea',
                            ref: 'pageDescription',
                            placeholder: 'Please Enter..',
                            rows: '4',
                            columns: '40',
                            maxlength: '18',
                            startFocus: false,
                            value: function(existingData){
                                debugger;
                                return existingData.pageDescription;
                            },
                            label: "Description"

                        },
                        {
                            name: 'pageRows',
                            type: 'textLiteral',
                            ref: 'pageRows',
                            value: function(existingData){
                                debugger;
                                return existingData.pageRows;
                            },
                            required: true,
                            size: '8',
                            maxlength: '8',
                            startFocus: false,
                            label: "Rows"
                        },
                        {
                            name: 'pageColumns',
                            type: 'textLiteral',
                            ref: 'pageColumns',
                            value: function(existingData){
                                debugger;
                                return existingData.pageColumns;
                            },
                            required: true,
                            size: '8',
                            maxlength: '8',
                            startFocus: false,
                            label: "Columns"
                        },
                        {
                            name: 'pageBackground',
                            type: 'backgroundPicker',
                            ref: 'pageBackground',
                            startFocus: false,
                            radioLabelStyle: "mr-[10px] text-lg",
                            value: function(existingData){
                                debugger;
                                if(existingData.pageBackground.backgroundType=='I'){
                                    console.log('pageBackground is image');
                                    return {
                                        backgroundType:'image',
                                        backgroundUrl:existingData.pageBackground.backgroundUrl,
                                        backgroundDisplay:existingData.pageBackground.backgroundDisplay
                                    }
                                }else{
                                    console.log('pageBackground is color');
                                    return {
                                        backgroundType:'color',
                                        colorValue:existingData.pageBackground.colorValue,

                                    }
                                }
                                return existingData.pageBackground;
                            },
                            label: "Background"
                        },
                        {
                            name: 'template',
                            type: 'inputCheckbox',
                            ref: 'template',
                            startFocus: false,
                            value: function(existingData){
                                debugger;
                                return existingData.template;
                            },
                            label: "Template ?"
                        },


                    ],
                menuDefs:{
                    twStyling:'text-xs text-blue-500 w-[100%]',
                    items: [
                        { type: 'menuItem', config: { label: 'Cancel', actionCode: c.MENU_EXIT_DIALOG } },
                        { type: 'menuItem', config: { label: 'Update', actionCode: c.MENU_SAVE_DIALOG_DATA} },
                    ],
                },
                defaultData:{
                    pageName: "New Page (default)",
                    pageDescription: "New Page Description",
                },
                dialogData: function(emit, c, loginStore, ready, result, config) {
 //                   import { createPinia } from 'pinia'
 //                   const pinia = createPinia();
                    debugger;
//                    const store = useLogStateStore();
                    const loginResult= toRaw(loginStore.loginStatus);
                    console.log('loginResult dialog4 - ', loginResult);
                    const parms   = {
                        orgId:loginResult.orgId,
                        userId:loginResult.userName,
                        layoutId:loginResult.orgHome,
                    }
                    const {executeTrans} = getTrans();
                    const header = loginResult.access_token;
                    const dataReady = ref(false);
                    const transResult = ref({});
                    executeTrans(parms, c.ALL_PAGES,  c.API_PATH+'api/shan/getLayout?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
                    whenever(dataReady, () => {
                        debugger;
                        console.log('data is ready-', transResult._rawValue);
                        ready.value=true;
                        result.value = {
                            pageName: transResult._rawValue.layout.menu_label,
                            pageDescription: transResult._rawValue.layout.description,
                            pageRows: transResult._rawValue.layout.height,
                            pageColumns:transResult._rawValue.layout.width,
                            pageBackground: {
                                backgroundType: transResult._rawValue.layout.backgroundType,
                                backgroundColor: transResult._rawValue.layout.backgroundColor,
                                backgroundDisplay: transResult._rawValue.layout.backgroundDisplay,
                                backgroundImageUrl: transResult._rawValue.layout.backgroundImageUrl
                            },
                            template:transResult._rawValue.layout.width.template
                        }
                    })

                },
                addActions:function(currentFuncs){
                    currentFuncs[c.MENU_SAVE_DIALOG_DATA]=function(emit, dialogData){
                        debugger;
                        console.log('in update page settings');
                        const store = useLogStateStore();
                        const ready = ref(false);
                        const result = ref({});
                        const pageStore = useCurrentPage();
                        const loginResult= toRaw(store.loginStatus)
                        console.log('store.loginResult', loginResult);
                        console.log('pageStore-', pageStore.getCurrentPageId, pageStore.getCurrentPagePerms);
                        const {executeTrans} = getTrans();
                        const header = loginResult.access_token;
                        const dataReady = ref(false);
                        const transResult = ref({});
                        const parms = {
                            name: dialogData.pageName,
                            description: dialogData.pageDescription,
                            height:dialogData.pageRows,
                            width: dialogData.pageColumns,
                            backgroundColor: dialogData.pageBackground.backgroundColor,
                            backgroundType: dialogData.pageBackground.backgroundType,
                            backgroundImage: dialogData.pageBackground.backgroundImage,
                            backgroundDisplay: dialogData.pageBackground.backgroundDisplay,
                            template: dialogData.template,
                            userId: loginResult.userId,
                            orgId: loginResult.orgId,
                            layoutId: pageStore.getCurrentPageId,
                            permType: loginResult.loginPerms,
                        }
                        executeTrans(parms, c.UPDATE_PAGE_SETTINGS,  c.API_PATH+'api/shan/updateLayout?XDEBUG_SESSION_START=19884', 'POST', emit, c, header, dataReady, transResult);
                        whenever(dataReady, () => {
                            debugger;
                            console.log('update completed-', transResult._rawValue);
                        })


                    }
                    currentFuncs[c.MENU_EXIT_DIALOG]=function(emit, dialogData){
                        debugger;
                        console.log('new func exit dialog');
                        //                      const emit = defineEmits(['cevt']);
                        emit('cevt',[c.EXIT_DIALOG])
                    }
                }
            }
        }
        case 'configureCard':{
            return {
                dialogAppearence: {
                    twPrompt: 'text-lg text-current ml-[30%] my-[5%]',
                    prompt: 'Test Dialog',
                    twstyle:"fixed w-[50%] h-auto p-[2%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded border-2 border-blue-500 shadow-xl shadow-black",
                },
                dialogFields :[
                    {
                        name: 'cardBackground',
                        type: 'backgroundPicker',
                        ref: 'cardBackground',
                        startFocus: false,
                        radioLabelStyle: "mr-[10px] text-lg",
                        value: function(existingData){
                            //debugger;
                            if(existingData.cardBackground.backgroundType=='I'){
                                console.log('pageBackground is image');
                                return {
                                    backgroundType:'image',
                                    backgroundUrl:existingData.cardBackground.backgroundUrl,
                                    backgroundDisplay:existingData.cardBackground.backgroundDisplay
                                }
                            }else{
                                console.log('pageBackground is color');
                                return {
                                    backgroundType:'color',
                                    colorValue:existingData.cardBackground.backgroundColor,

                                }
                            }
                            return existingData.cardBackground;
                        },
                        label: "Background"
                    },
                    {
                        name: 'shadow',
                        type: 'inputCheckbox',
                        ref: 'shadow',
                        startFocus: false,
                        value: function(existingData){
                            //debugger;
                            return existingData.shadow;
                        },
                        label: "Shadow ?"
                    },
                    {
                        name: 'roundedCorners',
                        type: 'inputCheckbox',
                        ref: 'roundedCorners',
                        startFocus: false,
                        value: function(existingData){
                            //debugger;
                            return existingData.roundedCorners;
                        },
                        label: "Rnd. Corners ?"
                    },
                    {
                        name: 'borderInclude',
                        type: 'borderPicker',
                        ref: 'borderInclude',
                        startFocus: false,
                        value: function(existingData){
                            //debugger;
                            if(existingData.borderInclude==true){

                            }
                            return existingData.borderInclude;
                        },
                        label: "Borders ?"

                    },
                    {
                        name: 'primaryFont',
                        type: 'fontPicker',
                        ref: 'primaryFont',
                        startFocus: false,
                        label: 'Font',
                        showSublabels: true,
                        value: function (val) {
                            console.log('primary font val', toRaw(val));
                            return toRaw(val);
                        },
                    },
                    {
                        name: 'secondaryFont',
                        type: 'fontPicker',
                        ref: 'secondaryFont',
                        startFocus: false,
                        label: 'Sub-Font',
                        showSublabels: false,
                        value: function(val){
                            console.log('secondary font val',toRaw(val));
                            return toRaw(val);
                        }
                    }


                ],
                menuDefs:{
                    twStyling:'text-xs text-blue-500 w-[100%]',
                    items: [
                        { type: 'menuItem', config: { label: 'Cancel', actionCode: c.MENU_EXIT_DIALOG } },
                        { type: 'menuItem', config: { label: 'Update', actionCode: c.SAVE_DIALOG_DATA} },
                    ],
                },
                dialogData: function(emit, c, loginStore, ready, result, config){
                    const {loadCardAppearanceConfigs, saveCardAppearanceConfigs, createCard} = getAppearanceConfigs();
                    loadCardAppearanceConfigs(emit, c, loginStore, ready, result, config);
                },
                addActions:function(currentFuncs) {
                    currentFuncs[c.MENU_EXIT_DIALOG]=function(emit, dialogData){
                        //debugger;
                        console.log('new func exit dialog');
                        //const emit = defineEmits(['cevt']);
                        emit('cevt',[c.EXIT_DIALOG])
                    }
                    currentFuncs[c.MENU_SAVE_DIALOG_DATA]=function(emit, dialogData){
                        const {loadCardAppearanceConfigs, saveCardAppearanceConfigs, createCard} = getAppearanceConfigs();
                        saveCardAppearanceConfigs(emit, dialogData);
                    }
                }
            }
            break;
        }
        case 'createCard':{
            return {
                dialogAppearence: {
                    twPrompt: 'text-lg text-current ml-[30%] my-[5%]',
                    prompt: 'Test Dialog',
                    twstyle:"fixed w-[50%] h-auto p-[2%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded border-2 border-blue-500 shadow-xl shadow-black",
                },
                dialogFields :[
                    {
                        name: 'cardTitle',
                        type: 'inputText',
                        ref: 'cardTitle',
                        value: function(existingData){
                            debugger;
                            return "";
                        },
                        required: true,
                        size: '25',
                        maxlength: '35',
                        startFocus: true,
                        label: "Card Title"
                    },
                    {
                        name: 'cardType',
                        type: 'vselect',
                        ref: 'cardType',
                        startFocus: false,
                        value: function(existingData){
                            //debugger;
                            return 'notype';
                        },
                        label: "Type ?",
                        selectType: "pulldown",
                        selectOptions:[
                            {
                                value: 'notype',
                                label: 'Select Type',
                            },
                            {
                                value: 'textShow',
                                label: "Rich Text",
                            },
                            {
                                value: 'Headline',
                                label: "Headline"
                            },
                            {
                                value: 'navMenu',
                                label: "Navigation Menu"
                            },
                            {
                                value: 'pdf',
                                label: "PDF"
                            }

                        ]


                    },
                    {
                        name: 'cardBackground',
                        type: 'backgroundPicker',
                        ref: 'cardBackground',
                        startFocus: false,
                        radioLabelStyle: "mr-[10px] text-lg",
                        value: function(existingData){
                            //debugger;
                            if(existingData.cardBackground.backgroundType=='I'){
                                console.log('pageBackground is image');
                                return {
                                    backgroundType:'image',
                                    backgroundUrl:existingData.cardBackground.backgroundUrl,
                                    backgroundDisplay:existingData.cardBackground.backgroundDisplay
                                }
                            }else{
                                console.log('pageBackground is color');
                                return {
                                    backgroundType:'color',
                                    colorValue:existingData.cardBackground.backgroundColor,

                                }
                            }
                            return existingData.cardBackground;
                        },
                        label: "Background"
                    },
                    {
                        name: 'shadow',
                        type: 'inputCheckbox',
                        ref: 'shadow',
                        startFocus: false,
                        value: function(existingData){
                            //debugger;
                            return existingData.shadow;
                        },
                        label: "Shadow ?"
                    },
                    {
                        name: 'roundedCorners',
                        type: 'inputCheckbox',
                        ref: 'roundedCorners',
                        startFocus: false,
                        value: function(existingData){
                            //debugger;
                            return existingData.roundedCorners;
                        },
                        label: "Rnd. Corners ?"
                    },
                    {
                        name: 'restricted',
                        type: 'inputCheckbox',
                        ref: 'restricted',
                        startFocus: false,
                        value: function(existingData){
                            //debugger;
                            return false;
                        },
                        label: "Restricted ?"
                    },
                    {
                        name: 'borderInclude',
                        type: 'borderPicker',
                        ref: 'borderInclude',
                        startFocus: false,
                        value: function(existingData){
                            //debugger;
                            if(existingData.borderInclude==true){

                            }
                            return existingData.borderInclude;
                        },
                        label: "Borders ?"

                    },
                    {
                        name: 'primaryFont',
                        type: 'fontPicker',
                        ref: 'primaryFont',
                        startFocus: false,
                        label: 'Font',
                        showSublabels: true,
                        value: function (val) {
                            console.log('font val', toRaw(val));
                            return toRaw(val);
                        },
                    },
                    {
                        name: 'secondaryFont',
                        type: 'fontPicker',
                        ref: 'secondaryFont',
                        startFocus: false,
                        label: 'Sub-Font',
                        showSublabels: false,
                        value: function(val){
                            console.log('font val',toRaw(val));
                            return toRaw(val);
                        }
                    }


                ],
                menuDefs:{
                    twStyling:'text-xs text-blue-500 w-[100%]',
                    items: [
                        { type: 'menuItem', config: { label: 'Cancel', actionCode: c.MENU_EXIT_DIALOG } },
                        { type: 'menuItem', config: { label: 'Create Card', actionCode: c.CREATE_NEW_CARD} },
                    ],
                },

                defaultData:{
                    borderColor: "#ff1e0f",
                    borderInclude: true,
                    borderType: "solid",
                    borderWidth: "medium",
                    cardBackground:{
                        backgroundType: "color",
                        backgroundColor: "#d1ffd3"
                    },
                    cardType: 'notype',
                    restricted: false,
                    roundedCorners: true,
                    shadow: true,
                    //primaryFont:{
                    primaryFont:{
                        fontFamily: 'Arial',
                        fontSize: '10pt',
                        fontWeight: 'bold',
                        fontStyle: 'normal',
                        fontAlign: 'left',
                        fontColor: '#FFAABB'
                    },
                    secondaryFont:{
                        fontFamily: 'Arial',
                        fontSize: '10pt',
                        fontWeight: 'bold',
                        fontStyle: 'normal',
                        fontAlign: 'left',
                        fontColor: '#FFAABB'
                    }

                },
                addActions:function(currentFuncs) {
                    currentFuncs[c.MENU_EXIT_DIALOG]=function(emit, dialogData){
                        //debugger;
                        console.log('new func exit dialog');
                        //const emit = defineEmits(['cevt']);
                        emit('cevt',[c.EXIT_DIALOG])
                    }
                    currentFuncs[c.CREATE_NEW_CARD]=function(emit, dialogData){
                        const {loadCardAppearanceConfigs, saveCardAppearanceConfigs, createCard} = getAppearanceConfigs();
                        debugger;
                        if(dialogData.cardType=='notype'){
                            alert('You Must Select a Type');
                            return;
                        }
                        if(typeof(dialogData.cardTitle)=='undefined'){
                            alert('You Must Enter a Card Name and tab through the field');
                            return
                        }
                        createCard(emit, dialogData);
                    }
                }
            }
            break;
        }
        case 'pageCreate':{
            return {
                dialogAppearence: {
                    twPrompt: 'text-lg text-current ml-[30%] my-[5%]',
                    prompt: 'Test Dialog',
                    twstyle:"fixed w-[50%] h-auto p-[2%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded border-2 border-blue-500 shadow-xl shadow-black",
                },
                dialogFields :
                    [

                        {
                            name: 'pageName',
                            type: 'inputText',
                            ref: 'pageName',
                            value: function(existingData){
                                //debugger;
                                return existingData.pageName;
                            },
                            required: true,
                            size: '25',
                            maxlength: '35',
                            startFocus: true,
                            label: "Page Name"
                        },
                        {
                            name: 'pageDescription',
                            type: 'vtextarea',
                            ref: 'pageDescription',
                            placeholder: 'Please Enter..',
                            rows: '4',
                            columns: '40',
                            maxlength: '18',
                            startFocus: false,
                            value: function(existingData){
                                //debugger;
                                return existingData.pageDescription;
                            },
                            label: "Description"

                        },
                        {
                            name: 'pageRows',
                            type: 'inputNumber',
                            ref: 'pageRows',
                            value: function(existingData){
                                //debugger;
                                return existingData.pageRows;
                            },
                            required: true,
                            size: '8',
                            maxlength: '8',
                            startFocus: false,
                            label: "Rows"
                        },
                        {
                            name: 'pageColumns',
                            type: 'inputNumber',
                            ref: 'pageColumns',
                            value: function(existingData){
                                //debugger;
                                return existingData.pageColumns;
                            },
                            required: true,
                            size: '8',
                            maxlength: '8',
                            startFocus: false,
                            label: "Columns"
                        },
                        {
                            name: 'pageBackground',
                            type: 'backgroundPicker',
                            ref: 'pageBackground',
                            startFocus: false,
                            radioLabelStyle: "mr-[10px] text-lg",
                            value: function(existingData){
                                //debugger;
                                if(existingData.pageBackground.backgroundType=='I'){
                                    console.log('pageBackground is image');
                                    return {
                                        backgroundType:'image',
                                        backgroundUrl:existingData.pageBackground.backgroundUrl,
                                        backgroundDisplay:existingData.pageBackground.backgroundDisplay
                                    }
                                }else{
                                    console.log('pageBackground is color');
                                    return {
                                        backgroundType:'color',
                                        colorValue:existingData.pageBackground.colorValue,

                                    }
                                }
                                return existingData.pageBackground;
                            },
                            label: "Background"
                        },
                        {
                            name: 'template',
                            type: 'inputCheckbox',
                            ref: 'template',
                            startFocus: false,
                            value: function(existingData){
                                //debugger;
                                return existingData.template;
                            },
                            label: "Template ?"
                        },


                    ],
                menuDefs:{
                    twStyling:'text-xs text-blue-500 w-[100%]',
                    items: [
                        { type: 'menuItem', config: { label: 'Cancel', actionCode: c.MENU_EXIT_DIALOG } },
                        { type: 'menuItem', config: { label: 'Save', actionCode: c.MENU_SAVE_DIALOG_DATA} },
                    ],
                },
                defaultData:{
                    pageName: "New Page (default)",
                    pageDescription: "New Page Description",
                },
                dialogData: function(emit, c, loginStore, ready, result, config) {
                    //debugger;
                    result.value = {
                        pageName: '',
                        pageDescription: '',
                        pageRows: 15,
                        pageColumns:15,
                        pageBackground: {
                            backgroundType: 'C',
                            backgroundColor: ' #f5df2a',
                            backgroundDisplay: '',
                            backgroundImageUrl: ''
                        },
                        template:'N'

                    }
                    ready.value=true;
                },



                addActions:function(currentFuncs){
                    currentFuncs[c.MENU_SAVE_DIALOG_DATA]=function(emit, dialogData){
                        //debugger;
                        console.log('in update page settings');
                        const store = useLogStateStore();
                        const pageStore = useCurrentPage();
                        const ready = ref(false);
                        const result = ref({});
                        const loginResult= toRaw(store.loginStatus)
                        console.log('store.loginResult', loginResult);
                        console.log('pageStore-', pageStore.getCurrentPageId, pageStore.getCurrentPagePerms);
                        const {executeTrans} = getTrans();
                        const header = loginResult.access_token;
                        const dataReady = ref(false);
                        const transResult = ref({});
                        var bType ='';
                        if(dialogData.pageBackground.backgroundType=='color'){
                            bType = 'C';
                        }else{
                            bType = 'I';
                        }
                        const parms = {
                            name: dialogData.pageName,
                            description: dialogData.pageDescription,
                            height:dialogData.pageRows,
                            width: dialogData.pageColumns,
                            pageRows: dialogData.pageRows,
                            pageColumns: dialogData.pageColumns,
                            backgroundColor: dialogData.pageBackground.backgroundColor,
                            backgroundType: bType,
                            backgroundImage: dialogData.pageBackground.backgroundImage,
                            backgroundDisplay: dialogData.pageBackground.backgroundDisplay,
                            template: dialogData.template,
                            userId: loginResult.userId,
                            orgId: loginResult.orgId,
                            layoutId: pageStore.getCurrentPageId,
                            permType: loginResult.loginPerms,
                        }
                        executeTrans(parms, c.UPDATE_PAGE_SETTINGS,  c.API_PATH+'api/shan/createLayoutNoBlanks?XDEBUG_SESSION_START=19884', 'POST', emit, c, header, dataReady, transResult);
                        whenever(dataReady, () => {
                            //debugger;
                            console.log('update completed-', transResult._rawValue);
//                            pageStore.setCurrentPageId(transResult._rawValue);
                            emit('cevt',[c.CHANGE_LAYOUT, transResult._rawValue]);
                        })


                    }
                    currentFuncs[c.MENU_EXIT_DIALOG]=function(emit, dialogData){
                        //debugger;
                        console.log('new func exit dialog');
                        //                      const emit = defineEmits(['cevt']);
                        emit('cevt',[c.EXIT_DIALOG])
                    }
                }
            }
        }

        case 'editLinks':{
            return {
                dialogAppearence: {
                    // styling for the prompt
                    twPrompt: 'text-lg text-current ml-[30%] my-[5%]',
                    // the prompt itself
                    prompt: 'My Spaces',
                    // overall styling for the dialog
                    twstyle:"fixed w-[50%] h-auto p-[2%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded border-2 border-blue-500 shadow-xl shadow-black",
                },
                dialogFields:
                    [
                        {
                            // the field name
                            name: 'editLinks',
                            // the component type of the field
                            type: 'listTable',
                            // the ref inserted into the field so it can be referenced later
                            ref: 'editLinks',
                            // this sets rowsToShow, but I think it's overwritten later - do we really need this ???
                            selectSize:'4',
                            // will this get initial focus
                            startFocus: false,
                            // styling of the table header
                            twhead: 'bg-blue-800 flex text-white w-full h-10',
                            // styling of the row (tr) element in the header
                            twheadtr: 'flex w-full mb-4',
                            // styling for the table body
                            twbody: 'bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full',
                            //row styling in the body
                            twtr:'flex w-full mb-[1px] hover:bg-green-400 text-xs',
                            // not in use
                            testtwheadth:'py-2 pl-3.5 w-1/4',
                            //cell styling in the body
                            twtd:'flex w-full mb-4 hover:bg-green-400',
                            // pager button styling
                            pagerButtonCss:"mr-[3px] mt-[10px] px-3 py-1 text-xs font-medium text-center text-black bg-white rounded-lg active:bg-red-400",
                            // active pager button styling -= not sure this does anything
                            pagerButtonCssActive:"mr-[3px] mt-[10px] px-3 py-1 text-xs font-medium text-center text-black bg-blue-300 rounded-lg active:bg-red-400",
                            // should the pager be included
                            includePager:false,
                            // the actual columns to be displayed.  Styling for those columns is included
                            columns: [
                                {
                                    field: 'id',
                                    label: 'ID',
                                    width: '10%',
                                    numeric: true,
                                    visible: true,
                                    twtd:'py-2 pl-3.5 w-1/6',
                                    twheadth:'py-2 pl-3.5 w-1/6'
                                },
                                {
                                    field: 'menu_label',
                                    label: 'Name',
                                    width: '30%',
                                    visible: true,
                                    twtd:'py-2 pl-3.5 w-1/4',
                                    twheadth:'py-2 pl-3.5 w-1/4'
                                },
                                {
                                    field: 'description',
                                    label: 'Description',
                                    width: '30%',
                                    visible: true,
                                    twtd:'py-2 pl-3.5 w-1/4',
                                    twheadth:'py-2 pl-3.5 w-1/4'

                                },


                                {
                                    field: 'width',
                                    label: 'Width',
                                    width: '10%',
                                    visible: true,
                                    twtd:'py-2 pl-3.5 w-1/4',
                                    twheadth:'py-2 pl-3.5 w-1/4'
                                }
                            ],
                            // label for the table
                            label: "Existing Links"
                        }
                    ],
                dialogData: function(emit, c, loginStore, ready, result, config){
                    console.log('in editLink dialogData');
                    result.value = {
                        funcReadAllData: function(tableReload, dataToShow, loaderFunctionsReady, currentTableConfig, componentId){
                            //debugger;
                            const {executeTrans} = getTrans();

                            const loginResult= toRaw(loginStore.loginStatus);
                            const header = loginResult.access_token;
                            const dataReady = ref(false);
                            const transResult = ref({});
                            const parms = {
                                cardId:componentId,
                            }
                            executeTrans(parms, c.ALL_PAGES,  c.API_PATH+'api/shan/getLinks?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
                            whenever(dataReady, () => {
                                //debugger;
                                console.log('update completed-', transResult._rawValue);
                                dataToShow.value = transResult._rawValue;
                                currentTableConfig.value.rowsToShow = dataToShow.value.length;
                                loaderFunctionsReady.value = true;
                                tableReload.value+=1;
                            })
                        },
                    }
                    ready.value=true;
                },
                addActions:function(currentFuncs){
                    currentFuncs[c.MENU_EXIT_DIALOG]=function(emit, dialogData){
                        //debugger;
                        console.log('new func exit dialog');
                        //                      const emit = defineEmits(['cevt']);
                        emit('cevt',[c.EXIT_DIALOG])
                    }
                },
                menuDefs:{
                    twStyling:'text-xs text-blue-500 w-[100%]',
                    items: [
                        { type: 'menuItem', config: { label: 'Cancel', actionCode: c.MENU_EXIT_DIALOG } },
                    ],
                },
            }
        }

        case 'mySpaces':{
            return {
                dialogAppearence: {
                    // styling for the prompt
                    twPrompt: 'text-lg text-current ml-[30%] my-[5%]',
                    // the prompt itself
                    prompt: 'My Spaces',
                    // overall styling for the dialog
                    twstyle:"fixed w-[50%] h-auto p-[2%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded border-2 border-blue-500 shadow-xl shadow-black",
                },
                // an array of objects represewnting the fields in the dialog
                dialogFields:
                 [
                     {
                         // the field name
                         name: 'mySpaces',
                         // the component type of the field
                         type: 'listTable',
                         // the ref inserted into the field so it can be referenced later
                         ref: 'mySpaces',
                         // this sets rowsToShow, but I think it's overwritten later - do we really need this ???
                         selectSize:'4',
                         // will this get initial focus
                         startFocus: false,
                         // styling of the table header
                         twhead: 'bg-blue-800 flex text-white w-full h-10',
                         // styling of the row (tr) element in the header
                         twheadtr: 'flex w-full mb-4',
                         // styling for the table body
                         twbody: 'bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full',
                         //row styling in the body
                         twtr:'flex w-full mb-[1px] hover:bg-green-400 text-xs',
                         // not in use
                         testtwheadth:'py-2 pl-3.5 w-1/4',
                         //cell styling in the body
                         twtd:'flex w-full mb-4 hover:bg-green-400',
                         // pager button styling
                         pagerButtonCss:"mr-[3px] mt-[10px] px-3 py-1 text-xs font-medium text-center text-black bg-white rounded-lg active:bg-red-400",
                         // active pager button styling -= not sure this does anything
                         pagerButtonCssActive:"mr-[3px] mt-[10px] px-3 py-1 text-xs font-medium text-center text-black bg-blue-300 rounded-lg active:bg-red-400",
                         // should the pager be included
                         includePager:true,
                         // the actual columns to be displayed.  Styling for those columns is included
                         columns: [
                             {
                                 field: 'id',
                                 label: 'ID',
                                 width: '10%',
                                 numeric: true,
                                 visible: true,
                                 twtd:'py-2 pl-3.5 w-1/6',
                                 twheadth:'py-2 pl-3.5 w-1/6'
                             },
                             {
                                 field: 'menu_label',
                                 label: 'Name',
                                 width: '30%',
                                 visible: true,
                                 twtd:'py-2 pl-3.5 w-1/4',
                                 twheadth:'py-2 pl-3.5 w-1/4'
                             },
                             {
                                 field: 'description',
                                 label: 'Description',
                                 width: '30%',
                                 visible: true,
                                 twtd:'py-2 pl-3.5 w-1/4',
                                 twheadth:'py-2 pl-3.5 w-1/4'

                             },


                             {
                                 field: 'width',
                                 label: 'Width',
                                 width: '10%',
                                 visible: true,
                                 twtd:'py-2 pl-3.5 w-1/4',
                                 twheadth:'py-2 pl-3.5 w-1/4'
                             }
                         ],
                         // label for the table
                         label: "My Spaces"
                     }
                ],
                // functions related to loading the data to populate the table
                dialogData: function(emit, c, loginStore, ready, result, config) {
                    //debugger;

                    result.value = {
                            // load everything in the database into dataToShow
                            funcReadAllData: function(tableReload, dataToShow, loaderFunctionsReady, currentTableConfig, componentId){
                                //debugger;
                                const {executeTrans} = getTrans();

                                const loginResult= toRaw(loginStore.loginStatus);
                                const header = loginResult.access_token;
                                const dataReady = ref(false);
                                const transResult = ref({});
                                const parms = {
                                    orgId:loginResult.orgId,
                                    userId:loginResult.userName,
                                }
                                executeTrans(parms, c.ALL_PAGES,  c.API_PATH+'api/shan/getMySpaces?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
                                whenever(dataReady, () => {
                                    //debugger;
                                    console.log('update completed-', transResult._rawValue);
                                    dataToShow.value = transResult._rawValue;
                                    currentTableConfig.value.rowsToShow = dataToShow.value.length;
                                    loaderFunctionsReady.value = true;
                                    tableReload.value+=1;
                                })
                            },
                            // read a portion of the data into dataToShow.  Defined by offset (where to start) and
                            // limit (how much to read)  Completion of this function triggers a refresh of the table
                            funcReadPagedData: function(tableConfig, limit, offset, loaderFunctionsReady, tableReload, dataToShow){
                                //debugger;
                                const loginResult= toRaw(loginStore.loginStatus);
                                const {executeTrans} = getTrans();
                                const parms = {
                                    orgId:loginResult.orgId,
                                    userId:loginResult.userName,
                                    limit: limit,
                                    offset: offset,
                                }
                                const header = loginResult.access_token;
                                const dataReady = ref(false);
                                const transResult = ref({});
                                executeTrans(parms, c.FIRST_PAGE,  c.API_PATH+'api/shan/getMySpacesPaged?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
                                whenever(dataReady, () => {
                                    //debugger;
                                    console.log('readPagedData-', transResult._rawValue);
                                    tableConfig.value.dataToShow = transResult._rawValue;
                                    dataToShow.value = transResult._rawValue;
                                    loaderFunctionsReady.value = true;
                                    tableReload.value+=1;
                                })
                            },
                            funcGetCapabilities: function(){console.log('getCapabilities')},
                            funcReadNext: function(){console.log('readNext')},
                            funcReadPrev: function(){console.log('readPrev')},
                            funcReadFirst: function(){
                                //debugger;
                                const loginResult= toRaw(loginStore.loginStatus);
                                const {executeTrans} = getTrans();
                                const parms = {
                                    orgId:loginResult.orgId,
                                    userId:loginResult.userName,
                                }
                                const header = loginResult.access_token;
                                const dataReady = ref(false);
                                const transResult = ref({});
                                executeTrans(parms, c.FIRST_PAGE,  c.API_PATH+'api/shan/getMySpacesPaged?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
                                whenever(dataReady, () => {
                                    //debugger;
                                    console.log('update completed-', transResult._rawValue);
                                })
                            },
                            funcReadLast: function(){console.log('readLast')},
                            funcReadThisRecord: function(){console.log('readThis Record')},
                            funcGetRecordCount: function(tableConfig, perPage, pagerProps){
                                //debugger;
                                const loginResult= toRaw(loginStore.loginStatus);
                                const {executeTrans} = getTrans();
                                const parms = {
                                    orgId:loginResult.orgId,
                                    userId:loginResult.userName,
                                }
                                const header = loginResult.access_token;
                                const dataReady = ref(false);
                                const transResult = ref({});
                                executeTrans(parms, c.PAGE_COUNT,  c.API_PATH+'api/shan/countMySpaces?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
                                whenever(dataReady, () => {
                                    //debugger;
                                    console.log('record count-', transResult._rawValue, );
                                    tableConfig.value.spacesCount = transResult._rawValue;
                                    tableConfig.value.totalPages = transResult._rawValue/perPage;
                                    pagerProps.value.totalPages = tableConfig.value.totalPages;
                                })

                            },


                    }
                    ready.value = true;
                    console.log('msypaces dialog data', result.value, ready.value);
                },
                // actions added to the dialog triggered by events
                addActions:function(currentFuncs){
                    currentFuncs[c.MENU_EXIT_DIALOG]=function(emit, dialogData){
                        //debugger;
                        console.log('new func exit dialog');
                        //const emit = defineEmits(['cevt']);
                        emit('cevt',[c.EXIT_DIALOG])
                    }
                    currentFuncs[c.ROW_SELECTED]=function(emit, evt){
                        //debugger;
                        console.log('new func row selected mySpaces', evt);
                        emit('cevt',[c.CHANGE_LAYOUT, evt]);
                    }
                    currentFuncs[c.RESOLVE_DATA]=function(dialogFields, evt){
                        //debugger;
                        return dialogFields[0].dataToShow[evt[1]].id;
  //                      return dataToShow.value[evt[1]];
                    }
                },
                // the menu displayed at the bottom of the dialog
                menuDefs:{
                    twStyling:'text-xs text-blue-500 w-[100%]',
                    items: [
                        { type: 'menuItem', config: { label: 'Cancel', actionCode: c.MENU_EXIT_DIALOG } },
                    ],
                },
            }
        }

        case 'loginDialog':{
            return {
                dialogAppearence: {
                    twPrompt: 'text-lg text-current ml-[30%] my-[5%]',
                    prompt: 'Please Log In...',
                    twstyle:"fixed w-[50%] h-[40%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded border-2 border-blue-500 shadow-xl shadow-black pl-[5%] pt-[5%]",
                    menuOpts:"loginMenu",

                },
                dialogFields : [
                    {
                        type:'inputText',
                        name: 'userId',
                        fieldSize: 30,
                        label: 'User Id:',
                        required: true,
                        startFocus: true,
                        labelStyle:'text-sm text-blue-500 mr-[10%]',
                        tailwindStyle:'text-sm my-0.5 outline-blue-500 rounded focus:outline-2 focus:outline-blue-500 hover:outline-2 hover:outline-red-500 rounded'
                    },
                    {
                        type: 'htmlPasswordInput',
                        name: 'password',
                        label: 'Password:',
                        labelStyle: 'text-sm text-blue-500 mr-[10%]',
                        fieldSize: 30,
                        tailwindStyle:'text-sm my-0.5 outline-blue-500 rounded focus:outline-2 focus:outline-blue-500 hover:outline-2 hover:outline-red-500 rounded',
                        startFocus: false,
                    }
                ],
                defaultData:{},
                dialogData: false,
                menuDefs:{
                    twStyling:'text-xs text-blue-500 w-[60%] mt-[15%] ml-[10%]',
                    items: [
 //                       { type: 'menuItem', config: { label: 'Login', actionCode: c.MENU_LOGIN } },
                        { type: 'menuItem', config: { label: 'Cancel', actionCode: c.MENU_CANCEL_LOGIN } },
                    ],
                },
                addActions:function(currentFuncs){
                    currentFuncs[c.MENU_CANCEL_LOGIN]=function(emit, dialogData){
                        //debugger;
                        console.log('new func exit dialog');
  //                      const emit = defineEmits(['cevt']);
                        emit('cevt',[c.EXIT_DIALOG])
                    }
                    currentFuncs[c.MENU_LOGIN]=function(emit, dialogData){
                        //debugger;
                        console.log('new func menu login');
                        const {doLogin}= getLogin();
                        doLogin(dialogData.userId, dialogData.password, emit, c)
                    }

                    currentFuncs[c.FIELD_CHANGE_EVENT]=function(evt, emit, dialogData){
                        console.log('in c.FIELD_CHANGE_EVENT-', evt, dialogData);
                        if(evt[1]==='password'){
                            emit('cevt', [c.CHANGE_DIALOG_CONFIGURATION, c.CHANGE_MENU_CONFIGURATION, "loginMenuB", dialogData]);
                        }


                    }


                    //return currentFuncs;
                }
            }
        }
        case 'loginMenuB':{
            return {
                dialogAppearence: {

                },
                dialogFields : [
                ],
                defaultData:{},
                dialogData: false,
                menuDefs:{
                    twStyling:'text-xs text-blue-500 w-[60%] mt-[15%] ml-[10%]',
                    items: [
                        { type: 'menuItem', config: { label: 'Login', actionCode: c.MENU_LOGIN } },
                        { type: 'menuItem', config: { label: 'Cancel', actionCode: c.MENU_CANCEL_LOGIN } },
                    ],
                },
                addActions:function(currentFuncs){

                }
            }
        }



    }
}
