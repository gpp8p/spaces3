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
        }
    }


})
