import {c} from "../components/constants.js";

export function getDialogDefinitions(){
    const getDialog = function(c, dialogDef){
        switch(dialogDef){
            case 'loginDialog':{
                return {
                    login:{
                        twPrompt: 'text-lg text-current ml-[30%] my-[5%]',
                        prompt: 'Please Log In...',
                        twstyle:"fixed w-[50%] h-[40%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded border-2 border-blue-500 shadow-xl shadow-black",
                        menuOpts:"loginMenu",
                        fields:[
                            {
                                type:'htmlTextInput',
                                name: 'userId',
                                fieldSize: 30,
                                label: 'User Id:',
                                required: true,
                                initialFocus: true,
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
                                initialFocus: false,
                            }
                        ]
                    }
                }
            }


        }
    }
    return {getDialog}
}
