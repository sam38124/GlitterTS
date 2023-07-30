import axios from "axios";

interface DB {
    query: (sql: string, par: any[]) => Promise<string[]>,
}

interface USER {
    user: { userID: string, userData: string }
}

function setup(config: {
    auth: {
        account: string,
        pwd: string
    },
    domain: string,
    app_name: string,
    router: {
        name: string,
        route: string,
        execute: (db: DB, user: USER) => Promise<any>
    }[]
}) {
    let data = JSON.stringify(config.auth);
    axios.request({
        method: 'post',
        url: config.domain + '/api/v1/user/login',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
        .then((response: any) => {
            const token = response.data.userData.token
            axios.request({
                method: 'get',
                url: `${config.domain}/api/v1/private?appName=${config.app_name}&key=sql_api_config_post`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => {
                    let postData = config.router.map((dd) => {
                        return {
                            "sql": `{
 execute: ${dd.execute.toString()}
}`,
                            "route": dd.route,
                            "title": dd.name,
                            "expand": false
                        }
                    })
                    axios.request({
                        method: 'post',
                        url: `${config.domain}/api/v1/private`,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({
                            "appName": config.app_name,
                            "key": "sql_api_config_post",
                            "value": {
                                "expand": true,
                                "apiList": postData
                            }
                        })
                    })
                        .then((response) => {
                            console.log("部署成功");
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                });

        })
        .catch((error: any) => {
            console.log(error);
        });
}

function create_function(fun:(db: DB, user: USER) =>Promise<any>){
    return fun
}

export const lambda={
    setup:setup,
    create_function:create_function,
}
