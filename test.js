var href='https://www.google.com.tw/webhp?authuser=1'

function getData(){
    try {
        let sPageURL = href.substring(href.indexOf('?')+1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        let mapData={}
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            mapData[sParameterName[0]]=sParameterName[1]
        }
        return mapData;
    }catch (e){
        return {}
    }
}
console.log(JSON.stringify(getData()))