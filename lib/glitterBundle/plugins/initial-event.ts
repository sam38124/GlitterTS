export class InitialEvent{
    public static execute(url:string,fun:(callback:()=>void)=>void){
        fun(()=>{
            const glitter=(window as any).glitter
            const ur=new URL(url)
            glitter.share.callBackList[ur.searchParams.get("callback")!]()
        })
    }
}