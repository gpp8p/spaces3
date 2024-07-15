import { defineStore } from 'pinia'

export const useLogStateStore = defineStore('logState', {
    //state
    state: () => ({
        loginStatus: {}
    }),
    //getters
    getters: {
        getLoginStatus(){
            return state.loginStatus;
        }
    },
    //actions
    actions: {
        setLoginStatus(loginResult){
            this.loginStatus = loginResult;
        }
    }


})


