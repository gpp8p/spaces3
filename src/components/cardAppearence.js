import {c} from "../components/constants.js";
import {getLogin} from "./login.js";
import {defineEmits, toRaw} from 'vue'
import {getTrans} from "./dbTrans.js";
import {ref} from 'vue';
import { useAsyncState, whenever } from '@vueuse/core'
import {createPinia, storeToRefs} from "pinia";
import {useLogStateStore} from "../stores/logState.js";
import {useCurrentPage} from "../stores/currentPage.js";

export function getAppearanceConfigs(){
    const loadCardAppearanceConfigs = function(emit, c, loginStore, ready, result, config){
        const loginResult= toRaw(loginStore.loginStatus);
        console.log('loginResult dialog4 - ', loginResult);

        const parms   = {
            cardId:config.id,
            layoutId:config.layoutId
        }
        const {executeTrans} = getTrans();
        const header = loginResult.access_token;
        const dataReady = ref(false);
        const transResult = ref({});
        console.log('in card configure dialog data - config is-', config);
        console.log('parms are-', parms);
        executeTrans(parms, c.CARD_MENUS_CONFIGURE,  c.API_PATH+'api/shan/getCardDataById?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
        whenever(dataReady, () => {
            //debugger;
            var cParams = toRaw(transResult);
            var cardConfigParams = cParams._rawValue[0];
            console.log('card configuration data is ready-', cParams._rawValue[0]);
            var configurationCurrentValues = {};
            var cardConfigurationDelimiterAt;
            var configValue;
            var styling = {};
            for (var c = 0; c < cardConfigParams.length; c++) {
                var thisCarConfigurationKey = cardConfigParams[c][0];
                var thisCardConfigurationValue = cardConfigParams[c][1];
                styling[thisCarConfigurationKey] = thisCardConfigurationValue;
                cardConfigurationDelimiterAt = thisCardConfigurationValue.indexOf(':');
                configValue = thisCardConfigurationValue.substr(cardConfigurationDelimiterAt + 1);
                configValue = configValue.replace(';', '');
                configurationCurrentValues[thisCarConfigurationKey] = configValue;
            }
            console.log('configurationCurrentValues-', configurationCurrentValues);
            debugger;
            if (typeof (configurationCurrentValues) != 'undefined') {
                if (typeof (configurationCurrentValues.backgroundTypeColor) != 'undefined') {
                    if (configurationCurrentValues.backgroundTypeColor == 'checked') {
//                                existingData.cardBackground.backgroundType='C';
                        result.value.cardBackground = {
                            backgroundType: 'color',
                            backgroundColor: configurationCurrentValues.backgroundColor,
                        }
                    } else {
                        result.value.cardBackground = {
                            backgroundType: 'image',
                            backgroundUrl: configurationCurrentValues.backgroundImageUrl,
                            backgroundDisplay: configurationCurrentValues.backgroundDisplay,
                        }

                    }
                }
                if (typeof (configurationCurrentValues.shadow) != 'undefined') {
                    if (configurationCurrentValues.shadow == 'checked') {
                        result.value.shadow = true;
                    } else {
                        result.value.shadow = false;
                    }
                } else {
                    result.value.shadow = false;
                }
                if (typeof (configurationCurrentValues.roundedCorners != 'undefined')) {
                    if (configurationCurrentValues.roundIncluded == 'checked') {
                        result.value.roundedCorners = true;
                    } else {
                        result.value.roundedCorners = false;
                    }
                } else {
                    result.value.roundedCorners = false;
                }
                if (typeof (configurationCurrentValues.borderInclude != 'undefined')) {
                    if (configurationCurrentValues.borderInclude == 'checked') {
                        result.value.borderInclude = true;
                        if (typeof (configurationCurrentValues.border) != 'undefined') {
                            var borderElements = configurationCurrentValues.border.split(" ");
                            result.value.borderColor = borderElements[2];
                            result.value.borderType = borderElements[1];
                            result.value.borderWidth = borderElements[0];
                            console.log('borderElements-', borderElements);
                        }
                    } else {
                        result.value.barderInclude = false;
                    }
                }

            }
            ready.value = true;
        })
    }
    const saveCardAppearanceConfigs = function(emit, dialogData){
        debugger;
        console.log('in update page settings', dialogData);
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
        var newParameters = {};
        var updatePackage = [];
        if(typeof(dialogData.shadow)!='undefined'){
            if(dialogData.shadow==true){
                newParameters['boxShadow']= "box-shadow: 10px 20px 30px black;";
                newParameters['shadow']="shadow:checked;";
            }
        }
        if(typeof(dialogData.borderInclude)!='undefined'){
            if(dialogData.borderInclude==true){
                newParameters['border']="border:"+dialogData.borderWidth+" "+dialogData.borderType+" "+dialogData.borderColor+";";
                newParameters['borderSize']='border-width:'+dialogData.borderWidth+";";
                newParameters['borderColor']="border-color:"+dialogData.borderColor+";";
                newParameters['borderInclude']="borderInclude:checked;";
            }
        }
        if(typeof(dialogData.roundedCorners)!='undefined'){
            if(dialogData.roundedCorners==true){
                newParameters['borderRadius']= "border-radius:8px;";
                newParameters['roundIncluded']="roundIncluded:checked;";
            }
        }
        if(typeof(dialogData.cardBackground)!='undefined'){
            if(dialogData.cardBackground.backgroundType=='color'){
                newParameters['backgroundTypeColor']="backgroundTypeColor:checked;";
                newParameters['backgroundColor']="background-color:"+dialogData.cardBackground.backgroundColor+";";
            }else{
                newParameters['backgroundTypeImage']="backgroundTypeImage:checked;";
                newParameters['backgroundImage']="background-image:url("+dialogData.cardBackground.backgroundUrl+");";
                newParameters['backgroundSize']="background-size:"+dialogData.cardBackground.backgroundDisplay;
                //repeat??
            }
        }
        console.log('newParameters', newParameters);
        updatePackage[0]=dialogData.cardId;
        updatePackage[1]=newParameters;
        updatePackage[2]={};
        updatePackage[3]=[];
        console.log('updatePackage', updatePackage);
        var updateParameters = JSON.stringify(updatePackage);
        const parms = {
            cardParams: updateParameters
        }
        executeTrans(parms, c.CHANGE_LAYOUT,  c.API_PATH+'api/shan/saveCardParameters?XDEBUG_SESSION_START=19884', 'POST', emit, c, header, dataReady, transResult);
        whenever(dataReady, () => {
            //debugger;
            console.log('update completed-', transResult._rawValue);
            emit('cevt',[c.CHANGE_LAYOUT, pageStore.getCurrentPageId]);
        })


    }

    return {loadCardAppearanceConfigs, saveCardAppearanceConfigs}
}
