import asyncHooks from 'async_hooks';

interface RequestInfo {
    uuid: string;
    method: string;
    url: string;
    ip: string;
}

class AsyncHook {
    store: Map<number, any>;
    constructor(){
        this.store = new Map();
        asyncHooks.createHook({
            init: (asyncId:number, _, triggerAsyncId:number) => {
                if (this.store.has(triggerAsyncId)) {
                    this.store.set(asyncId, this.store.get(triggerAsyncId));
                }
            },
            destroy: (asyncId:number) => {
                if (this.store.has(asyncId)) {
                    this.store.delete(asyncId);
                }
            }
        }).enable();
    }
    createRequestContext(requestInfo:RequestInfo){
        this.store.set(asyncHooks.executionAsyncId(), requestInfo);
        return;
    }
    getRequestContext():RequestInfo{
        return this.store.get(asyncHooks.executionAsyncId());
    }
}

export class Singleton {
    private static instance: AsyncHook;
    private constructor() {
        throw Error('This is singletion, please use getInstance method to get the instance');
    }
    public static getInstance(): AsyncHook {
        if (!Singleton.instance) {
            Singleton.instance = new AsyncHook();
        }
        return Singleton.instance;
    }
}

export { Singleton as asyncHooks };