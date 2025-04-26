export class ServerCache {
  //暫存的空間
  public static share: any = {};
  //設定暫存
  public static setCache(tag: string, fun: (callback: (response: any) => any) => void, callback: any) {
    ServerCache.share[tag] = ServerCache.share[tag] || {
      callback: [],
      data: undefined,
      isRunning: false,
    };
    if (ServerCache.share[tag].data) {
      callback &&
        callback(
          (() => {
            try {
              return JSON.parse(JSON.stringify(ServerCache.share[tag].data));
            } catch (e) {
              console.log(`parseError`, ServerCache.share[tag].data);
            }
          })()
        );
    } else {
      ServerCache.share[tag].callback.push(callback);
      if (!ServerCache.share[tag].isRunning) {
        ServerCache.share[tag].isRunning = true;
        fun((response: any) => {
          ServerCache.share[tag].callback.map((callback: any) => {
            callback &&
              callback(
                (() => {
                  try {
                    return JSON.parse(JSON.stringify(response));
                  } catch (e) {
                    console.log(`parseError`, ServerCache.share[tag].data);
                  }
                })()
              );
          });
          ServerCache.share[tag].data = JSON.parse(JSON.stringify(response));
          ServerCache.share[tag].callback = [];
        });
      }
    }
  }
  //清空暫存
  public static clearCache(tag: string) {
    delete ServerCache.share[tag]
  }
}