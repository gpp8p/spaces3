import {c} from "../components/constants.js";
import {getLogin} from "./login.js";
import { defineEmits} from 'vue'





export function getDialogDefinitions(){
    const getDialogAppearence = function(dialogDef){
        var currentDefs = defs(dialogDef);
//        debugger;
        return currentDefs.dialogAppearence;
    }
    const getDialogFields = function(dialogDef){
        debugger;
        var currentDefs = defs(dialogDef);
        return currentDefs.dialogFields;
    }
    const getDefaultData = function(dialogDef){
        var currentDefs = defs(dialogDef);
        return currentDefs.defaultData;
    }
    const getMenuDefinitions = function(dialogDef){
        var currentDefs = defs(dialogDef);
        return currentDefs.menuDefs;
    }
    const getActions = function(dialogDef){
        var currentDefs = defs(dialogDef);
        return currentDefs.addActions
    }
    return {getDialogAppearence, getDialogFields, getDefaultData, getMenuDefinitions, getActions}
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
    switch(dialogDef){
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
                menuDefs:{
                    twStyling:'text-xs text-blue-500 w-[60%] mt-[15%] ml-[10%]',
                    items: [
                        { type: 'menuItem', config: { label: 'Login', actionCode: c.MENU_LOGIN } },
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
                    //return currentFuncs;
                }
            }
        }



    }
}
