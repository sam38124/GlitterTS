export class ProductInitial{
  public static initial(content:any){
    //補上language-data
    content.language_data =  content.language_data ?? {};
    ['en-US','zh-CN','zh-TW'].map((dd)=>{
      if(!content.language_data[dd]){
        content.language_data[dd] = {
          "seo": content.seo,
          "title":content.title,
          "content": content.content,
          "sub_title": content.sub_title,
          "content_json": content.content_json,
          "content_array": content.content_array,
          "preview_image": content.preview_image
        };
      }
    });
  }
}