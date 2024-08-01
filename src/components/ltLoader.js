import {ref, toRaw} from 'vue';
import {getTrans} from "./dbTrans.js";
import {c} from "./constants.js";
import {whenever} from "@vueuse/core";
import {useLogStateStore} from "../stores/logState.js";

export function getLoaders(loaderType){

    switch (loaderType){

        case 'inMemory':{
            const readAllData=function(existingData){
                console.log('returning this-',toRaw(existingData))
                return toRaw(existingData);
            }
            const getRecordCount=function(existingData){
                return existingData.length;
            }
            const getCapabilities=function(){
                return {
                    readNext: true,
                    readPrev: true,
                    readFirst: true,
                    readLast: true,
                    readThisRecord: true,
                    updateThisRecord: false,
                    updateAll: false,
                    recordCount: true
                }
            }
            const readNext = function(existingData, limit, offset){
                debugger;
                console.log('offset-',offset);
                console.log('limit-', limit);
                console.log('defaultData readNext');
                console.log('slicing offset, offset+limit', offset, offset+limit);
                var start = offset;
                var end = offset + limit;
                console.log('slice-',existingData.slice(start, end));
                return existingData.slice(start, end);
            }
            const readPrev = function(existingData, limit, offset){
                console.log('defaultData readPrev');
                var start = offset;
                var end = start + limit;
                console.log('slice-',existingData.slice(start, end));
                return existingData.slice(start, end);


            }
            const readFirst = function(existingData, limit, offset){
                debugger;
                console.log('offset-',offset);
                console.log('limit-', limit);
                console.log('slice-',existingData.slice(offset, offset+limit));
                console.log('slice4', existingData.slice(offset, limit));
                offset =0;
                return existingData.slice(offset, offset+limit);
            }
            const readLast = function(existingData, limit, offset){
                debugger;
                console.log('defaultData readLast');
                console.log('slice4 readlast', existingData.slice(offset, limit));
                return existingData.slice(offset, offset+limit);
            }
            const readThisRecord = function(existingData, limit, offset){
                console.log('defaultData readThisRecord');
                var start = offset;
                var end = start + limit;
                console.log('slice-',existingData.slice(start, end));
                return existingData.slice(start, end);
            }
            debugger;
            return {readAllData, getCapabilities, readNext, readPrev, readFirst, readLast, readThisRecord, getRecordCount};
        }
        case 'remoteTrans':{
            const {executeTrans} = getTrans();
            const loginStore = useLogStateStore();
            const loginResult= toRaw(loginStore.loginStatus);
            const readAllData=function(existingData){
                console.log('page parms-', parms);
                const header = '';
                const dataReady = ref(false);
                const transResult = ref({});
//const ready = ref(false);
                const parms   = {
                    orgId:loginResult.orgId,
                    userId:loginResult.userName,
                }
                executeTrans(parms, c.ALL_PAGES,  c.API_PATH+'api/shan/getMySpaces?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
                whenever(dataReady, () => {
                    debugger;
                    console.log('data is ready-', transResult);


                })
            }
            const getRecordCount=function(existingData){
                console.log('page parms-', parms);
                const header = '';
                const dataReady = ref(false);
                const transResult = ref({});
//const ready = ref(false);
                const parms   = {
                    orgId:loginResult.orgId,
                    userId:loginResult.userName,
                }
                executeTrans(parms, c.PAGE_COUNT,  c.API_PATH+'api/shan/countMySpaces?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
                whenever(dataReady, () => {
                    debugger;
                    console.log('data is ready-', transResult);


                })
//                return existingData.length;
            }
            const getCapabilities=function(){
                return {
                    readNext: true,
                    readPrev: true,
                    readFirst: true,
                    readLast: true,
                    readThisRecord: true,
                    updateThisRecord: false,
                    updateAll: false,
                    recordCount: true
                }
            }
            const readNext = function(existingData, limit, offset){
                readSpan(existingData, limit, offset);
            }
            const readPrev = function(existingData, limit, offset){
                console.log('defaultData readPrev');
                readSpan(existingData, limit, offset);

            }
            const readFirst = function(existingData, limit, offset){
                debugger;
                console.log('readFirst offset-',offset);
                console.log('read First limit-', limit);
                readSpan(existingData, limit, offset);

            }
            const readLast = function(existingData, limit, offset){
                debugger;
                console.log('readlast offset, limit', offset, limit);
                readSpan(existingData, limit, offset);
            }
            const readThisRecord = function(existingData, limit, offset){
                console.log('db readThisRecord');
                var start = offset;
                var end = start + limit;
                console.log('readThis-',start, end);
            }
            const readSpan = function(existingData, limit, offset){
                debugger;
                console.log('offset-',offset);
                console.log('limit-', limit);
                console.log('defaultData readNext');
                console.log('loading offset, readNext offset+limit', offset, offset+limit);
                var start = offset;
                var end = offset + limit;
                console.log('page parms-', parms);
                const header = '';
                const dataReady = ref(false);
                const transResult = ref({});
//const ready = ref(false);
                const parms   = {
                    orgId:loginResult.orgId,
                    userId:loginResult.userName,
                    limit:start,
                    offset:end,
                }
                executeTrans(parms, c.PAGE_COUNT,  c.API_PATH+'api/shan/getMySpacesPaged?XDEBUG_SESSION_START=19884', 'GET', emit, c, header, dataReady, transResult);
                whenever(dataReady, () => {
                    debugger;
                    console.log('data is ready-', transResult);


                })

            }
            debugger;
            return {readAllData, getCapabilities, readNext, readPrev, readFirst, readLast, readThisRecord, getRecordCount};
        }
    }

}
