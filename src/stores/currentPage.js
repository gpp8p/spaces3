import { defineStore } from 'pinia'

export const useCurrentPage = defineStore('currentPage', {
    //state
    state: () => ({
        currentPage: {}
    }),
    //getters
    getters: {
        getCurrentPageId(){
            return this.currentPage.pageId;
        },
        getCurrentPagePerms(){
            return this.currentPagePerms;
        },
        getAreaSelected(){
            return this.currentPage.areaSelected;
        }
    },
    //actions
    actions: {
        setCurrentPageId(pageId){
            debugger;
            this.currentPage.pageId = pageId;
        },
        setCurrentPagePerms(perms){
            this.currentPagePerms = perms;
        },
        setAreaSelected(areaSelected){
            this.currentPage.areaSelected = areaSelected;
        }
    }


})
