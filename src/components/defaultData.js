import { ref } from 'vue';
import { isProxy, toRaw } from 'vue';

export function getDataSource(){
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
