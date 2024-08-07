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
                dialogData: function(emit, c, loginStore, ready, result) {
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
                    const header = '';
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
                        const header = '';
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
        case 'mySpaces':{
            return {
                dialogAppearence: {
                    twPrompt: 'text-lg text-current ml-[30%] my-[5%]',
                    prompt: 'My Spaces',
                    twstyle:"fixed w-[50%] h-auto p-[2%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded border-2 border-blue-500 shadow-xl shadow-black",
                },
                dialogFields:
                 [
                     {
                         name: 'mySpaces',
                         type: 'listTable',
                         ref: 'mySpaces',
                         selectSize:'4',
                         startFocus: false,
                         twhead: 'bg-blue-800 flex text-white w-full h-10',
                         twheadtr: 'flex w-full mb-4',
                         twbody: 'bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full',
                         twtr:'flex w-full mb-[1px] hover:bg-green-400 text-xs',
                         testtwheadth:'py-2 pl-3.5 w-1/4',
                         twtd:'flex w-full mb-4 hover:bg-green-400',
                         pagerButtonCss:"mr-[3px] mt-[10px] px-3 py-1 text-xs font-medium text-center text-black bg-white rounded-lg active:bg-red-400",
                         pagerButtonCssActive:"mr-[3px] mt-[10px] px-3 py-1 text-xs font-medium text-center text-black bg-blue-300 rounded-lg active:bg-red-400",
                         includePager:true,
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

                         label: "My Spaces"
                     }
                ],
                dialogData: function(emit, c, loginStore, ready, result) {
                    debugger;

                    result.value = {

                            funcReadAllData: function(){console.log('readAllData-invoked from list table')},
                            funcGetCapabilities: function(){console.log('getCapabilities')},
                            funcReadNext: function(){console.log('readNext')},
                            funcReadPrev: function(){console.log('readPrev')},
                            funcReadFirst: function(){console.log('readFirst')},
                            funcReadLast: function(){console.log('readLast')},
                            funcReadThisRecord: function(){console.log('readThis Record')},
                            funcGetRecordCount: function(){console.log('recordCount')},


                    }
                    ready.value = true;
                    console.log('msypaces dialog data', result.value, ready.value);
                },
                addActions:function(currentFuncs){
                    console.log('my spaces add acctions');
                },
                menuDefs:{
                    twStyling:'text-xs text-blue-500 w-[100%]',
                    items: [
                        { type: 'menuItem', config: { label: 'Cancel', actionCode: c.MENU_EXIT_DIALOG } },
                    ],
                },
            }
        }
        case 'testDialog':{
            return {
                dialogAppearence: {
                    twPrompt: 'text-lg text-current ml-[30%] my-[5%]',
                    prompt: 'Test Dialog',
                    twstyle:"fixed w-[50%] h-auto p-[2%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded border-2 border-blue-500 shadow-xl shadow-black",
                },
                dialogFields :
                    [
                        /*
                        {
                            name: 'field1',
                            type: 'inputText',
                            ref: 'field1',
                            value: function(existingData){
                                debugger;
                                return existingData.name;
                            },
                            required: true,
                            size: '10',
                            maxlength: '18',
                            startFocus: true,
                            label: "Field 1"
                        },
                        {
                            name: 'field2',
                            type: 'inputNumber',
                            ref: 'field2',
                            value: function(existingData){
                                debugger;
                                return existingData.num;
                            },
                            size: '5',
                            stepVal: '0.5',
                            required: true,
                            maxlength: '5',
                            tailwindStyle: "border py-2 px-3 text-grey-darkest text-sm outline outline-2 outline-blue-500 focus:outline-red-500 hover:outline-red-500 rounded",
                            startFocus: false,
                            label: "Field 2"
                        },
/*
                        {
                            name: 'field3',
                            type: 'inputText',
                            ref: 'field3',
                            placeholder: 'Please Enter..',
                            size: '20',
                            maxlength: '18',
                            startFocus: false,
                            value: function(existingData){
                                debugger;
                                return existingData.city;
                            },
                            label: "Field 3"

                        },


                        {
                            name: 'field4',
                            type: 'inputCheckbox',
                            ref: 'field4',
                            startFocus: false,
                            value: function(existingData){
                                debugger;
                                return existingData.field4;
                            },
                            label: "Field 4"
                        },
                        {
                            name: 'field5',
                            type: 'backgroundPicker',
                            ref: 'field5',
                            startFocus: false,
                            radioLabelStyle: "mr-[10px] text-lg",
                            value: function(existingData){
                                debugger;
                                return existingData.field5;
                            },
                            label: "Field 5"
                        },
                        {
                            name: 'field6',
                            type: 'radioGroup',
                            ref: 'field6',
                            startFocus: false,
                            value: function(existingData){
                                debugger;
                                return existingData.field6;
                            },
                            buttonLabelStyle: "mr-[10px] text-lg",
                            radioButtons :[
                                {
                                    label: 'red',
                                    value: 'red'
                                },
                                {
                                    label: 'blue',
                                    value: 'blue'
                                },
                                {
                                    label: 'green',
                                    value: 'green'
                                },
                            ],
                            orientation: 'vertical',
                            label: "Field 6"
                        },

                        {
                            name: 'field7',
                            type: 'vselect',
                            ref: 'field7',
                            startFocus: false,
                            selectType: "scroll",
                            selectSize: 3,
                            selectMultiple: true,
                            value: function(existingData){
                                debugger;
                                return existingData.field7;
                            },
                            selectStyle: 'mr-[10px] text-lg',

                            selectLabelStyle: "mr-[10px] text-lg",
                            selectOptions :[
                                {
                                    label: 'red',
                                    value: 'red'
                                },
                                {
                                    label: 'blue',
                                    value: 'blue'
                                },
                                {
                                    label: 'green',
                                    value: 'green'
                                },
                                {
                                    label: 'orange',
                                    value: 'orange'
                                },
                            ],
                            label: "Field 7"
                        },

                        {
                            name: 'field8',
                            type: 'vtextarea',
                            ref: 'field8',
                            placeholder: 'Please Enter..',
                            rows: '6',
                            columns: '40',
                            maxlength: '18',
                            startFocus: false,
                            value: function(existingData){
                                debugger;
                                return existingData.field8;
                            },
                            label: "Field 8"

                        },

*/
                        {
                            name: 'field9',
                            type: 'listTable',
                            ref: 'field9',
                            selectSize:'4',
                            startFocus: false,
                            twhead: 'bg-blue-800 flex text-white w-full h-10',
                            twheadtr: 'flex w-full mb-4',
                            twbody: 'bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full',
                            twtr:'flex w-full mb-[1px] hover:bg-green-400 text-xs',
                            testtwheadth:'py-2 pl-3.5 w-1/4',
                            twtd:'flex w-full mb-4 hover:bg-green-400',
                            pagerButtonCss:"mr-[3px] mt-[10px] px-3 py-1 text-xs font-medium text-center text-black bg-white rounded-lg active:bg-red-400",
                            pagerButtonCssActive:"mr-[3px] mt-[10px] px-3 py-1 text-xs font-medium text-center text-black bg-blue-300 rounded-lg active:bg-red-400",
                            includePager:true,
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

                            value: function(existingData, loaders, loaderFunctionsReady){
                                async function loadModule() {
                                    const targetModule = './defaultData.js';
                                    try {
                                        const myModule = await import(targetModule);
                                        console.log('successful module import');
                                        const {readAllData, getCapabilities, readNext, readPrev, readFirst, readLast, readThisRecord, getRecordCount} = myModule.getDataSource();
                                        console.log('readAllData-', readAllData);

                                        loaders.value = {
                                            funcReadAllData: readAllData,
                                            funcGetCapabilities: getCapabilities,
                                            funcReadNext: readNext,
                                            funcReadPrev: readPrev,
                                            funcReadFirst: readFirst,
                                            funcReadLast: readLast,
                                            funcReadThisRecord: readThisRecord,
                                            funcGetRecordCount: getRecordCount
                                        }
                                        loaderFunctionsReady.value=true;
//                                        debugger;
                                    } catch (error) {
                                        console.error('Error importing module:', error);
                                    }
                                }
                                loadModule();
                                return existingData.field9;
                            },
                            label: "Field 9"
                        }


                ],
                defaultData:{
                    name: "Curious George",
                    num: "7.5",
                    city: "The Zoo",
                    field4: true,
                    field5: {
                        backgroundType: 'color',
                        colorValue: '#FFAABB',
                        fileUploaded: false,
                    },
                    field6: "blue",
                    field7: "orange",
                    field8: "Now is the time for every good man to come to the aid of his country",
                    field9: [
                        {"id":1,"description":"created in insert 1229","menu_label":"insert create 1229","height":15,"width":15},
                        {"id":2,"description":"Default Template","menu_label":"Default Template","height":15,"width":15},
                        {"id":3,"description":"Land","menu_label":"Land","height":15,"width":15},
                        {"id":4,"description":"People","menu_label":"People","height":15,"width":15},
                        {"id":5,"description":"Our Setup","menu_label":"Our Setup","height":15,"width":15},
                        {"id":6,"description":"Documents","menu_label":"Documents","height":15,"width":15},
                        {"id":7,"description":"tatement of Values","menu_label":"Values Page","height":15,"width":15},
                        {"id":8,"description":"The Basics","menu_label":"The Basics","height":15,"width":15},
                        {"id":9,"description":"created in insert 1229","menu_label":"insert create 1229","height":15,"width":15},
                        {"id":10,"description":"Default Template","menu_label":"Default Template","height":15,"width":15},
                        {"id":11,"description":"Land","menu_label":"Land","height":15,"width":15},
                        {"id":12,"description":"People","menu_label":"People","height":15,"width":15},
                        {"id":13,"description":"Our Setup","menu_label":"Our Setup","height":15,"width":15},
                        {"id":14,"description":"Documents","menu_label":"Documents","height":15,"width":15},
                        {"id":15,"description":"tatement of Values","menu_label":"Values Page","height":15,"width":15},
                        {"id":16,"description":"The Basics","menu_label":"The Basics","height":15,"width":15},



                    ]
                },
                menuDefs:{},
                actions:function(currentFuncs){}
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
                        debugger;
                        console.log('new func exit dialog');
  //                      const emit = defineEmits(['cevt']);
                        emit('cevt',[c.EXIT_DIALOG])
                    }
                    currentFuncs[c.MENU_LOGIN]=function(emit, dialogData){
                        debugger;
                        console.log('new func menu login');
                        const {doLogin}= getLogin();
                        doLogin(dialogData.userId, dialogData.password, emit, c)
                    }

                    currentFuncs[c.FIELD_CHANGE_EVENT]=function(evt, emit, dialogData){
                        console.log('in c.FIELD_CHANGE_EVENT-', evt, dialogData);
                        if(evt[1]==='password'){
                            emit('cevt', [c.CHANGE_DIALOG_CONFIGURATION, c.CHANGE_MENU_CONFIGURATION, 'loginDialogB', dialogData]);
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
