import { defineStore } from 'pinia'

export const useDims = defineStore('dims', {
    state: () => ({
        currentDims: {}
    }),
    getters: {
        getDims(){
            return this.currentDims;
        }
    },
    actions: {
        setDims(dim){
            this.currentDims = dim;
        }
    }
})

