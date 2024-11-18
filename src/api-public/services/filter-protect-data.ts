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
                    data['fans_token']=undefined
                    data['fans_id']=undefined
                    break
                case 'login_google_setting':
                    data['secret']=undefined
                    break
                case 'login_apple_setting':
                    data['secret']=undefined
                    data['team_id']=undefined
                    data['bundle_id']=undefined
                    data['secret']=undefined
                    data['key_id']=undefined
                    break
            }
        }
        return data
    }
}