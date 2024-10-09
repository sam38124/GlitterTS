export class FilterProtectData{
    public static filter(key:string,data:any){
        if(data){
            switch (key) {
                case 'login_line_setting':
                    data['secret']=undefined
                    data['message_token']=undefined
                    break
                case 'login_fb_setting':
                    data['secret']=undefined
                    break
            }
        }
        return data
    }
}