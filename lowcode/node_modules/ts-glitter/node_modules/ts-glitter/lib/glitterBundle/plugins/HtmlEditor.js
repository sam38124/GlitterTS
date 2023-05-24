//表單產生器插件

// <div className="dropdown-menu" style="margin: 0px;">

// </div>
glitter.share.formEdit = {
    //大選項類型
    option: [
        {
            title: '單選題',
            event: function (data) {
                data.type = 'single';
                data.elem = 'checked';
            },
            elem: 'checked',
        },
        {
            title: '多選題',
            event: function (data) {
                data.type = 'multiple';
                data.elem = 'checked';
            },
            elem: 'checked',
        },
        {
            title: '輸入數字',
            event: function (data) {
                data.elem = 'input';
                data.type = 'number';
            },
        },
        {
            title: '顏色選擇',
            event: function (data) {
                data.elem = 'input';
                data.type = 'color';
            },
        },
        {
            title: '字串輸入',
            event: function (data) {
                data.elem = 'input';
                data.type = 'text';
            },
        },
        {
            title: '日期選擇',
            event: function (data) {
                data.elem = 'input';
                data.type = 'date';
            },
        },
        {
            title: '多行文本',
            event: function (data) {
                data.elem = 'textArea';
            },
        },
        {
            title: '圖片選擇',
            event: function (data) {
                data.elem = 'image';
            },
        },
        {
            title: '漸層顏色',
            event: function (data) {
                data.elem = 'lineColor';
            },
        },
        {
            title: '按鈕連結',
            event: function (data) {
                data.elem = 'buttonLink';
            },
        },
    ],
    //產生表單
    generateForm: function (data, child, window, formEditor, option) {
        if (formEditor) {
            if (data.length === 0) {
                data.push({});
            }
        }
        var event = window.event;
        var bindView = window.bindView;
        var notifyDataChange = window.notifyDataChange;
        var id = new Date().getTime();
        return `<div class="w-100 h-100 ${
            (option ?? {}).overflow ?? `overflow-scroll`
        }" style="box-sizing: border-box;padding-left: 2px;" id="${id}">
${bindView({
    bind: `${id}`,
    view: function () {
        var html = '';
        var thatData = data;

        function forEachData(data, index) {
            if (data !== undefined) {
                if ((option ?? {}).readonly) {
                    if (data) {
                        data.readonly = true;
                    }
                }
                if (formEditor) {
                    if (data.elem === undefined) {
                        data.elem = 'checked';
                        data.type = 'single';
                    }
                    html += `
                <div>
                <div class="d-flex align-items-center my-2">
                 <h3 class=" " style="font-weight: 300;color: lightcoral;">參數${index + 1}</h3>
               
                 <div style="flex: auto;"></div>
</div>
                     <input class="form-control flex-fill" placeholder="參數宣告" value="${data.title ?? ''}" onchange="${event(function (
                        e
                    ) {
                        data.title = $(e).val();
                    })}"> 
                <div class="d-flex w-100 align-items-center mt-2">
                <input class="form-control flex-fill" placeholder="參數名稱" value="${data.name ?? ''}" onchange="${event(function (e) {
                        data.name = $(e).val();
                    })}"> 
       <div class="btn-group ">
                                                    <button type="button" class="btn btn-light dropdown-toggle ms-2" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${
                                                        data.selectLabelHint ?? '尚未選擇'
                                                    }</button>
                                                    <div class="dropdown-menu" style="margin: 0px;max-height: 200px;overflow-y: scroll;">
                                 ${glitter.print(function () {
                                     var html = '';
                                     glitter.share.formEdit.option.map(function (d2) {
                                         html += ` <a class="dropdown-item" onclick="${event(function () {
                                             d2.event(data);
                                             data.selectLabelHint = d2.title;
                                             notifyDataChange(`${id}`);
                                         })}">${d2.title}</a>`;
                                     });
                                     return html;
                                 })}                      
                              
                                                    </div>
                                                </div>
                </div>
                </div>
                `;
                }
                var labelValue = function () {
                    if (child) {
                        return ``;
                    } else {
                        var inHtml = `<label  class="form-label" style="font-size: 16px;font-weight: 400;">
${data.need ? `<span style="color: red;font-size: 16px;font-weight: 300;">*</span>` : ``}
${data.name}</label>`;
                        if (data.customView) {
                            inHtml += data.customView;
                        }
                        return inHtml;
                    }
                };
                switch (data.elem) {
                    case 'checked':
                        var innerHtml = '';
                        if (formEditor) {
                            if (data.option === undefined) {
                                data.option = [];
                            }
                            if (!Array.isArray(data.option)) {
                                data.option = [];
                            }
                            data.option.map(function (d3, index) {
                                var dd = d3;
                                innerHtml += `
                                <div class="border rounded p-1 bg-primary mt-2">
                                <div class="d-flex w-100 align-items-center">
                                    <input class="form-control flex-fill me-2" placeholder="參數宣告" value="${
                                        dd.title ?? ''
                                    }" onchange="${event(function (e) {
                                    dd.title = $(e).val();
                                })}">
</div>  
                <div class="d-flex w-100 align-items-center mt-2">
              
                <input class="form-control flex-fill me-2" placeholder="參數名稱" value="${dd.name ?? ''}" onchange="${event(function (e) {
                                    dd.name = $(e).val();
                                })}">
       <div class="btn-group">
                                                    <button type="button" class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    ${dd.selectLabelHint ?? '選項'}</button>
                                                    <div class="dropdown-menu" style="margin: 0px;max-height: 200px;overflow-y: scroll;">
                                                        <a class="dropdown-item" onclick="${event(function () {
                                                            dd.elem = undefined;
                                                            dd.selectLabelHint = undefined;
                                                            notifyDataChange(`${id}`);
                                                        })}">基本</a>
                                                     ${glitter.print(function () {
                                                         var html = '';
                                                         glitter.share.formEdit.option
                                                             .filter((d2) => {
                                                                 return d2.elem !== 'checked';
                                                             })
                                                             .map(function (d2) {
                                                                 html += ` <a class="dropdown-item" onclick="${event(function () {
                                                                     d2.event(dd);
                                                                     dd.selectLabelHint = d2.title;
                                                                     notifyDataChange(`${id}`);
                                                                 })}">${d2.title}</a>`;
                                                             });
                                                         return html;
                                                     })}  
                                                       
                                                    </div>
                                                </div>
                                                 <i class="fa-solid text-white fa-trash-can ms-2 fs-5 me-1 d-flex align-items-center justify-content-center" style="font-size: 20px;cursor: pointer;" onclick="${event(
                                                     function () {
                                                         data.option.splice(index, 1);
                                                         notifyDataChange(`${id}`);
                                                     }
                                                 )}"></i>
                </div>
                
                </div>
                                `;
                            });
                            innerHtml += `
<div class="d-flex w-100 border-top  align-items-center mt-3" style="height: 60px;">
<button class="btn btn-primary mx-auto " onclick="${event(function () {
                                data.option.push({});
                                notifyDataChange(`${id}`);
                            })}">
<i class="fas fa-plus-circle me-2" aria-hidden="true" ></i>
添加選項</button>
<div class="flex-fill"></div>
<i class="fa-solid fa-trash-can me-2 fs-5 " aria-hidden="true" onclick="${event(function () {
                                glitter.share.customView.checkYesOrNot('是否確認刪除此參數??', function (result) {
                                    if (result) {
                                        thatData.splice(index, 1);
                                        notifyDataChange(`${id}`);
                                    }
                                });
                            })}" style="cursor: pointer;"></i>
</div>
`;
                        } else {
                            if (!child) {
                                innerHtml += `<div class="mt-2 w-100 fs-3">
${labelValue()}
</div>`;
                            }
                            innerHtml += `<div id="${index}" class="w-100">${bindView({
                                bind: `${index}`,
                                view: function () {
                                    var html = '';

                                    Object.keys(data.option).map(function (d3, index2) {
                                        var data2 = data.option[d3];
                                        html += `
<div class="div d-flex align-items-center mt-1" style="" >
<input class="form-check-input form-control" type="checkbox"  id="${index}${index2}" onchange="${event(function (e) {
                                            if (data.type === 'single') {
                                                Object.keys(data.option).map(function (d4) {
                                                    data.option[d4].checked = false;
                                                });
                                            }
                                            data2.checked = !data2.checked;

                                            window.notifyDataChange(`${index}`);
                                        })}" ${data2.checked ? `checked` : ``} ${data2.readonly ? `disabled` : ``}>
  <label class="form-label m-0" for="${index}${index2}" style="font-size: 16px;font-weight: 400;">
 ${data2.name}
  </label>
${data2.checked ? glitter.share.formEdit.generateForm([data2], true, window) : ''}
</div>

`;
                                    });
                                    return html;
                                },
                            })}</div>`;
                        }
                        html += innerHtml;
                        break;
                    case 'input':
                        if (formEditor) {
                            html += `<div class="d-flex w-100 border-bottom  align-items-center mt-1" style="height: 60px;">
<div class="flex-fill"></div>
<i class="fa-solid fa-trash-can me-2 fs-5 " aria-hidden="true" onclick="${event(function () {
                                glitter.share.customView.checkYesOrNot('是否確認刪除此參數??', function (result) {
                                    if (result) {
                                        thatData.splice(index, 1);
                                        notifyDataChange(`${id}`);
                                    }
                                });
                            })}" style="cursor: pointer;"></i>
</div>`;
                            return;
                        }
                        var textFilter = event(function (e) {
                            if (data.type === 'number') {
                                $(e).val(glitter.filterNumber($(e).val()));
                            }
                        });
                        var textClick = event(function (e) {
                            if (glitter.deviceType === glitter.deviceTypeEnum.Web) {
                                if (data.type === 'date') {
                                    glitter.openDiaLog('publicResource/dialog/Dia_Date_Picker.html', 'Dia_Date_Picker', false, false, {
                                        callback: function (text) {
                                            data.value = text.substring(0, 10);
                                            $(e).val(data.value);
                                            notifyDataChange(id);
                                            if ((option ?? {}).dataChange) {
                                                option.dataChange();
                                            }
                                        },
                                        data: {
                                            date: true,
                                            time: false,
                                            nowButton: false,
                                            clearButton: false,
                                            format: 'YYYY/MM/DD',
                                            lang: 'zh-cn',
                                        },
                                    });
                                } else if (data.type === 'time') {
                                    glitter.openDiaLog('publicResource/dialog/Dia_Date_Picker.html', 'Dia_Date_Picker', false, false, {
                                        callback: function (text) {
                                            data.value = text.substring(11, 16);
                                            $(e).val(data.value);
                                            notifyDataChange(id);
                                            if ((option ?? {}).dataChange) {
                                                option.dataChange();
                                            }
                                        },
                                        data: {
                                            date: false,
                                            time: true,
                                            nowButton: false,
                                            clearButton: false,
                                            format: 'hh:mm',
                                            lang: 'zh-cn',
                                        },
                                    });
                                }
                            }
                        });
                        var theValue = function () {
                            if (data.type === 'date') {
                                if (data.value) {
                                    return data.value.substring(0, 10);
                                } else {
                                    return '';
                                }
                            } else {
                                return data.value ?? '';
                            }
                        };
                        if (child) {
                            html += `<div class="mt-1 w-100">
<input class="form-control" type="${data.type !== undefined && data.type !== 'date' ? data.type : 'text'}" placeholder="${
                                data.placeHolder ?? `請輸入${data.name}`
                            }" id="billing-first-name" oninput="${textFilter}" onchange="${event(function (e) {
                                data.value = $(e).val();
                                if ((option ?? {}).dataChange) {
                                    option.dataChange();
                                }
                            })}" onclick="${textClick}" value="${theValue()}" ${data.readonly ? `readonly` : ``}>
</div>`;
                        } else {
                            html += `
<div class="mt-2 w-100">
${labelValue()}
<div class="input-group input-group-merge">
${glitter.print(function () {
    if (data.type === 'date') {
        return `<div class="form-control dropdown-toggle" onclick="${textClick}">${data.value ?? '請選擇日期'}</div>`;
    } else {
        return `<input class="form-control" style="height: 37px!important;;" type="${
            data.type !== undefined && data.type !== 'date' && !data.visible ? data.type : 'text'
        }" placeholder="${data.placeHolder ?? `請輸入${data.name}`}" id="billing-first-name" oninput="${textFilter}" onchange="${event(
            function (e) {
                data.value = $(e).val();
                if ((option ?? {}).dataChange) {
                    option.dataChange();
                }
            }
        )}" onclick="${textClick}" value="${theValue()}" ${data.readonly ? `readonly` : ``}>`;
    }
})}
  
                                           ${glitter.print(function () {
                                               if (data.type === 'password') {
                                                   return ` <div class="input-group-text " data-password="false" onclick="
 ${event(function () {
     data.visible = !data.visible;
     window.notifyDataChange('formView');
 })}
 ">
                                              <i class="fa-solid fa-eye"></i>
                                            </div>`;
                                               } else {
                                                   return ``;
                                               }
                                           })}
</div>

</div>`;
                        }
                        break;
                    case 'textArea':
                        if (formEditor) {
                            html += `<div class="d-flex w-100 border-bottom  align-items-center mt-1" style="height: 60px;">
<div class="flex-fill"></div>
<i class="fa-solid fa-trash-can me-2 fs-5 " aria-hidden="true" onclick="${event(function () {
                                glitter.share.customView.checkYesOrNot('是否確認刪除此參數??', function (result) {
                                    if (result) {
                                        thatData.splice(index, 1);
                                        notifyDataChange(`${id}`);
                                    }
                                });
                            })}" style="cursor: pointer;"></i>
</div>`;
                            return;
                        }
                        setTimeout(function () {
                            window.autosize(window.document.getElementById(data.id));
                        }, 300);
                        html += `
<div class="mt-2 w-100">
${labelValue()}
 <textarea class="form-control border rounded" id="${
     data.id
 }" rows="10" style="line-height: 25px; font-size: 15px; border: none; margin: 0; font-weight: 400; "
placeholder="${data.placeHolder ?? '請輸入' + data.name}" onchange="${event(function (e) {
                            data.value = $(e).val();
                            if ((option ?? {}).dataChange) {
                                option.dataChange();
                            }
                            // data.value = $(e).val().replace(/\n/g,'<br>')
                        })}" onfocus="${event(function () {
                            window.autosize(window.document.getElementById(data.id));
                        })}" ${data.readonly ? `readonly` : ``}>${data.value ?? ''}</textarea>
</div>

                  `;
                        break;
                    case 'drop-down':
                        html += `${labelValue()}
<div  class="w-100">
${glitter.print(function () {
    var html = '';
    data.option.map(function (d2) {
        html += ` <a class="dropdown-item" onclick="${event(function () {
            data.value = d2.value;
            notifyDataChange(id);
            if ((option ?? {}).dataChange) {
                option.dataChange();
            }
        })}">${d2.name}</a>`;
    });
    return `
                <div class="dropdown">
    <button class="btn btn-light dropdown-toggle" type="button" id="click-${index}" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        ${glitter.print(function () {
            if (data.value !== undefined) {
                return `${
                    data.option.find(function (dd) {
                        return dd.value === data.value;
                    }).name
                }`;
            } else {
                return data.placeHolder;
            }
        }, data.placeHolder)}
    </button>
    <div class="dropdown-menu" aria-labelledby="click-${index}" style="max-height: 200px;overflow-y: scroll;">
    ${html}
    </div>
</div>
                `;
})}
</div>
 `;
                        break;
                    case 'label':
                        html += `<div class="mt-2">${labelValue()}</div>`;
                        break;
                    case 'image':
                        if (formEditor) {
                            html += `
<div class="d-flex w-100 border-bottom  align-items-center mt-1" style="height: 60px;">
<div class="flex-fill"></div>
<i class="fa-solid fa-trash-can me-2 fs-5 " aria-hidden="true" onclick="${event(function () {
                                glitter.share.customView.checkYesOrNot('是否確認刪除此參數??', function (result) {
                                    if (result) {
                                        thatData.splice(index, 1);
                                        notifyDataChange(`${id}`);
                                    }
                                });
                            })}" style="cursor: pointer;"></i>
</div>
`;
                        } else {
                            html += `<div class="mt-2">${labelValue()}</div>`;
                            let chooseImage = event(function () {
                                glitter.chooseImage(function (response) {
                                    if (response.length > 0) {
                                        glitter.openDiaLog('glitterBundle/dialog/Dia_DataLoading.html', 'dataLoading', false, false, {});
                                        let map = {
                                            app: 'Pub',
                                            b64: response.map(function (dd) {
                                                return dd.data;
                                            }),
                                        };
                                        glitter.postRequest('PublicLogic', 'uploadImage', map, function (response) {
                                            glitter.closeDiaLogWithTag('dataLoading');
                                            if (response && response.result) {
                                                data.value = response.url[0];
                                                glitter.openDiaLog(
                                                    'glitterBundle/dialog/Dia_Success.html',
                                                    'Dia_Success',
                                                    false,
                                                    false,
                                                    '上傳成功',
                                                    function () {}
                                                );
                                            } else {
                                                glitter.openDiaLog(
                                                    'glitterBundle/dialog/Dia_Error.html',
                                                    'Dia_Error',
                                                    false,
                                                    false,
                                                    '上傳失敗',
                                                    function () {}
                                                );
                                            }
                                            notifyDataChange(`${id}_image`);
                                        });
                                    }
                                });
                            });
                            html += `<div id="${id}_image">
${bindView({
    bind: `${id}_image`,
    view: function () {
        if (glitter.isEmpty(data.value)) {
            return `<button class="btn btn-outline-primary" onclick="${chooseImage}">選擇圖片</button>  `;
        } else {
            return `<img src="${data.value}" class="w-100 rounded mx-auto ratio-16x9" onclick="${chooseImage}">`;
        }
    },
})}
</div>`;
                        }

                        break;
                    case 'lineColor':
                        if (formEditor) {
                            html += `<div class="d-flex w-100   align-items-center mt-1" style="height: 60px;">
<div class="flex-fill"></div>
<i class="fa-solid fa-trash-can me-2 fs-5 " aria-hidden="true" onclick="${event(function () {
                                glitter.share.customView.checkYesOrNot('是否確認刪除此參數??', function (result) {
                                    if (result) {
                                        thatData.splice(index, 1);
                                        notifyDataChange(`${id}`);
                                    }
                                });
                            })}" style="cursor: pointer;"></i>
</div>`;
                        } else {
                            html += `<div class="mt-2">${labelValue()}</div>
<div class="d-flex mt-2">
<span >初始</span>
<input class="ms-2" type="color"  onchange="${event(function (e) {
                                data.start = $(e).val();
                            })}" value="${data.start ?? ''}">
<span class="mx-2">結束</span>
<input type="color" onchange="${event(function (e) {
                                data.end = $(e).val();
                            })}" value="${data.end ?? ''}">
</div>
`;
                        }
                        break;
                    default:
                        if (formEditor) {
                            html += `<div class="d-flex w-100 border-bottom  align-items-center mt-1" style="height: 60px;">
<div class="flex-fill"></div>
<i class="fa-solid fa-trash-can me-2 fs-5 " aria-hidden="true" onclick="${event(function () {
                                glitter.share.customView.checkYesOrNot('是否確認刪除此參數??', function (result) {
                                    if (result) {
                                        thatData.splice(index, 1);
                                        notifyDataChange(`${id}`);
                                    }
                                });
                            })}" style="cursor: pointer;"></i>
</div>`;
                            return;
                        } else {
                            if (glitter.share.formEdit.extensionItem[data.elem] !== undefined) {
                                html += glitter.share.formEdit.extensionItem[data.elem](data, index, window);
                            }
                        }
                        break;
                }
                if (formEditor) {
                    html += `<div class="w-100 mb-2" style="height: 1px;background-color: lightgrey;"></div>`;
                } else {
                    if (!child) {
                        html += `<div class="w-100 " style="background-color: whitesmoke;height: 1px;margin-top: 10px;"></div>`;
                    }
                }
            }
        }

        if (Array.isArray(data)) {
            thatData.map(forEachData);
        } else {
            Object.keys(data).map(function (dd) {
                forEachData(data[dd], dd);
            });
        }

        if (formEditor) {
            html += `<div class="w-100" style="height: 50px;"></div>`;
        }
        return html;
    },
    onCreate: function () {
        if (option) {
            if (option.hideLabel) {
                window.$(`#${id} .formEdit-label`).hide();
            }
        }
    },
})}
</div>
${
    formEditor
        ? `
<div class="d-flex mt-2 position-absolute bottom-0 translate-middle-x start-50 bg-white w-100" style="max-width: calc(100% - 30px);padding-bottom: 5px;padding-top: 5px;z-index: 5;">
<button type="button" class="btn btn-secondary flex-fill me-2" onclick="${event(function () {
              data.push({});
              notifyDataChange(`${id}`);
          })}"><i class="fas fa-plus-circle me-2" aria-hidden="true"></i>添加參數</button>
<button type="button" class="btn btn-warning flex-fill ms-2" onclick="${event(function () {
              formEditor.save();
          })}">
儲存JSON</button>
</div>
`
        : `
`
}
`;
    },
    //CopyValue
    copyValue: function (origin, target) {
        try {
            if (!Array.isArray(origin)) {
                origin = [];
            }
            origin.map(function (d1) {
                var copyData = target.find(function (d2) {
                    return d1.title === d2.title && d1.elem === d2.elem;
                });

                if (copyData !== undefined) {
                    copyData.checked = d1.checked;
                    switch (copyData.elem) {
                        case 'textArea':
                        case 'selected':
                        case 'image':
                        case 'input':
                            copyData.value = d1.value;
                            break;
                        case 'checked':
                            glitter.share.formEdit.copyValue(d1.option, copyData.option);
                            break;
                        case 'lineColor':
                            copyData.start = d1.start;
                            copyData.end = d1.end;
                            break;
                        case 'BtnLink':
                            copyData.option = d1.option
                                .filter((w) => {
                                    var data = glitter.share.btnList.find((data2) => {
                                        return data2.title === w.value;
                                    });
                                    return data !== undefined;
                                })
                                .map((w) => {
                                    return glitter.share.btnList.find((data2) => {
                                        if (data2.title === w.value) {
                                            data2.name = w.name ?? data2.name;
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    });
                                });
                            break;
                        case 'form':
                            copyData.value = d1.value;
                            break;
                        case 'formEdit':
                            copyData.value = d1.value;
                            break;
                        default:
                            if (glitter.share.formEdit.copyValueItem[copyData.elem]) {
                                glitter.share.formEdit.copyValueItem[copyData.elem](copyData, d1);
                            }
                            break;
                    }
                }
            });
        } catch (e) {
            alert(e);
        }
    },
    //轉換成資料庫儲存格式
    formatToPostData: function (data) {
        var postData = {};
        data.map(function (dd) {
            if (dd.toPostData) {
                var d2 = dd.toPostData(dd);
                postData[d2.key] = d2.value;
            } else {
                switch (dd.elem) {
                    case 'textArea':
                    case 'selected':
                    case 'image':
                    case 'input':
                        postData[dd.title ?? dd.name] = dd.value;
                        break;
                    case 'checked':
                        postData[dd.title ?? dd.name] = dd.option;
                        break;
                    case 'lineColor':
                        postData[dd.title ?? dd.name] = { start: dd.start, end: dd.end };
                        break;
                    case 'BtnLink':
                        postData[dd.title ?? dd.name] = dd.option;
                        break;
                    case 'formEdit':
                        postData[dd.title ?? dd.name] = dd.value;
                        break;
                    case 'form':
                        postData[dd.title ?? dd.name] = dd.value;
                        break;
                }
            }
        });
        return postData;
    },
    //PostData轉Form
    postDataToForm: function (form, posData) {
        form.map((dd) => {
            switch (dd.elem) {
                case 'checked':
                    dd['option'] = posData[dd.title ?? dd.name] ?? dd['option'];
                    break;
                default:
                    dd['value'] = posData[dd.title ?? dd.name] ?? dd['value'];
                    break;
            }
        });
    },
    //拓展表單類型
    extensionItem: {},
    //Copy Data方式
    copyValueItem: {},
    //表單編輯器
    formEditor: function (data, window, custom, second) {
        custom = custom ?? {};
        var id = glitter.getUUID();
        var bindView = window.bindView;
        var event = window.event;
        var notifyDataChange = window.notifyDataChange;

        function clearFunction(dd) {
            if (!second) {
                // Object.keys(dd).map((d2)=>{
                //     dd[d2]=undefined
                // })
            }
        }

        var itemSelect = [
            {
                name: '單選題',
                click: (dd) => {
                    dd.elem = 'checked';
                    dd.type = 'single';
                },
            },
            {
                name: '多選題',
                click: (dd) => {
                    dd.elem = 'checked';
                    dd.type = undefined;
                },
            },
            {
                name: '數字輸入',
                click: (dd) => {
                    dd.elem = 'input';
                    dd.type = 'number';
                },
            },
            {
                name: '字串輸入',
                click: (dd) => {
                    dd.elem = 'input';
                    dd.type = 'text';
                },
            },
            {
                name: '日期選擇',
                click: (dd) => {
                    dd.elem = 'input';
                    dd.type = 'date';
                },
            },
            {
                name: '多行文本',
                click: (dd) => {
                    dd.elem = 'textArea';
                },
            },
        ];
        if (custom.itemSelect) {
            itemSelect = itemSelect.concat(custom.itemSelect);
        }

        function getSelectText(dd) {
            if (dd.cName) {
                return dd.cName;
            }
            switch (dd.elem) {
                case 'checked':
                    if (dd.type === 'single') {
                        return '單選題';
                    } else {
                        return '多選題';
                    }
                case 'input':
                    switch (dd.type) {
                        case 'text':
                            return '字串輸入';
                        case 'number':
                            return '數字輸入';
                        case 'date':
                            return '日期選擇';
                        default:
                            return '字串輸入';
                    }
                case 'textArea':
                    return '多行文本';
                default:
                    return '標題';
            }
        }

        return `<div id="${id}">
${bindView({
    bind: id,
    view: function () {
        var html = ``;
        data.map((dd, index) => {
            if (!second) {
                html += `<div class="d-flex align-items-center my-2">
                 <h3 class=" " style="font-weight: 300;color: lightcoral;">  ${custom.indexText ?? '問題'}${index + 1}</h3>
                 <div style="flex: auto;"></div>
</div>`;
            }
            html += `
<div class="d-flex w-100 align-items-center">
                <input class="form-control flex-fill" placeholder="請輸入表單標題" value="${dd.name ?? ''}" onchange="${event((e) => {
                dd.name = $(e).val();
            })}"> 
       <div class="btn-group ">
                                                    <button type="button" class="btn btn-light dropdown-toggle ms-2" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${getSelectText(
                                                        dd
                                                    )}</button>
                                                    <div class="dropdown-menu" style="margin: 0px;">
                                                      ${glitter.print(() => {
                                                          var html = '';
                                                          itemSelect.map((d3, index) => {
                                                              html += `  <a class="dropdown-item" onclick="${event((e) => {
                                                                  clearFunction(dd);
                                                                  d3.click(dd);
                                                                  notifyDataChange(id);
                                                              })}">${d3.name}</a>`;
                                                          });
                                                          return html;
                                                      })}
                                                    </div>
                                                </div>
                </div>
`;
            var leftItem = ``;
            switch (dd.elem) {
                case 'checked':
                    html += `<div class="w-100 mt-2"></div>`;
                    dd.option = glitter.toJson(dd.option, []);
                    var option = dd.option;
                    option.map((d2, index) => {
                        html += `<div class="d-flex w-100 align-items-center mb-2">
                <span class="fs-6 me-2">${index + 1}.</span>
                 <div class="form-check">
  <input class="form-check-input" type="checkbox" onclick="${event((e) => {
      if (dd.type === 'single') {
          option.map((d3) => {
              d3.checked = false;
          });
      }
      d2.checked = $(e).get(0).checked;
      notifyDataChange(id);
  })}" ${d2.checked ? `checked` : ``}>
</div>
                <input class="form-control flex-fill me-2" placeholder="請輸入選項名稱" value="${d2.name ?? ''}" onchange="${event((e) => {
                            d2.name = $(e).val();
                        })}" >
       <div class="btn-group">
                                                    <button type="button" class="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    ${getSelectText(d2)}
</button>
                                                    <div class="dropdown-menu" style="margin: 0px;">
                                                      ${glitter.print(() => {
                                                          var html = '';
                                                          itemSelect.map((d3, index) => {
                                                              html += `  <a class="dropdown-item" onclick="${event((e) => {
                                                                  clearFunction(dd);
                                                                  itemSelect[index].click(d2);
                                                                  notifyDataChange(id);
                                                              })}">${d3.name}</a>`;
                                                          });
                                                          return html;
                                                      })}
                                                    </div>
                                                </div>
                                               <i class="fa-solid fa-trash-can ms-2 fs-5 me-1 d-flex align-items-center justify-content-center" style="font-size: 20px;cursor: pointer;" onclick="
                                               ${event(() => {
                                                   option.splice(index, 1);
                                                   notifyDataChange(id);
                                               })}"></i> 
                </div>`;
                        switch (d2.elem) {
                            case 'checked':
                                html += `<div class="" >${glitter.share.formEdit.formEditor([d2], window, () => {}, true)}</div>`;
                        }
                    });
                    if (second) {
                        leftItem = `<button class="btn btn-warning mx-auto " onclick="${event(() => {
                            option.push({});
                            notifyDataChange(id);
                        })};">
 <i class="fas fa-plus-circle me-2" aria-hidden="true"></i> 
添加選項</button>`;
                    } else {
                        leftItem = `<button class="btn btn-primary mx-auto " onclick="${event(() => {
                            option.push({});
                            notifyDataChange(id);
                        })};">
 <i class="fas fa-plus-circle me-2" aria-hidden="true"></i> 
添加選項</button>`;
                    }

                    break;
            }

            html += `<div class="d-flex w-100 border-top border-bottom  align-items-center ${
                second ? `border-white mt-2` : `mt-3`
            } " style="height: 60px;">
${leftItem}
<div class="flex-fill"></div>
  <div class="form-check form-switch me-3 ">
  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault0" onchange="${event(() => {
      dd.need = !dd.need;
  })}" ${dd.need ? `checked` : ``} >
  <label class="form-check-label" for="flexSwitchCheckDefault0" style="font-weight: 300;font-size: 16px;">必填</label>
</div>
${
    second
        ? ``
        : ` <i class="fa-solid fa-trash-can me-2 fs-5 " aria-hidden="true" onclick="${event(() => {
              data.splice(index, 1);
              notifyDataChange(id);
          })}" style="cursor: pointer;"></i>`
}
</div>`;
        });
        if (!second) {
            html += `
<button class="w-100 btn btn-outline-primary align-items-center mt-2" onclick="${event(() => {
                data.push({});
                notifyDataChange(id);
            })}">
<i class="fa-regular fa-circle-plus me-1"></i>
${custom.addText ?? '添加選項'}
</button>
`;
        }
        if (second) {
            return `<div class="p-2 rounded border mb-2" style="background-color: wheat;">${html}</div>`;
        } else {
            return html;
        }
    },
})}
</div>`;
    },
    //表單生成器V2
    generateFormV2: function (data, window, callback, second) {
        var id = glitter.getUUID();
        var bindView = window.bindView;
        var event = window.event;
        var notifyDataChange = window.notifyDataChange;
        var $ = window.$;
        return `<div id="${id}" class="w-100">
${bindView({
    bind: id,
    view: function () {
        var html = ``;
        data.map((dd, index) => {
            if (!dd.custom) {
                html += `
<div class="w-100 fs-3 d-flex ">
<label class="form-label fw-bold" style="font-size: 16px;font-weight: 400;">
<span class="fw-bold ${dd.need ? `` : `d-none`} " style="color: red;font-size: 18px;font-weight: 300;">*</span>
${(typeof dd.name === 'function' ? dd.name() ?? '' : dd.name ?? '') ?? ''}</label>
<div class="flex-fill"></div>
${
    dd.preView
        ? `
<button class="btn btn-warning" onclick="${event(() => {
              var editEdit = glitter.getUUID();
              $('#standard-modal').remove();
              $('body').append(`
<div id="standard-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="standard-modalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered ${glitter.frSize({ sm: `` }, 'm-0')}">
        <div class="modal-content">
            <div class="modal-header  d-flex border-bottom">
                <h4 class="modal-title fw-light" style="font-size: 28px;" id="standard-modalLabel">預覽</h4>
                <div class="flex-fill"></div>
                 <button type="button" class="btn" data-bs-dismiss="modal" aria-hidden="true" style="margin-right: -10px;"><i class="fa-regular fa-circle-xmark text-white" style="font-size: 25px;"></i></button>
            </div>
            <div class="modal-body pt-2 px-2" id="${editEdit}">${bindView(() => {
                  //表單ID
                  return {
                      bind: `${editEdit}`,
                      view: function () {
                          return glitter.share.formEdit.generateFormV2(JSON.parse(JSON.stringify(dd.value)), window, () => {});
                      },
                  };
              })}
            </div>
            <div class="modal-footer w-100">
                <button type="button" class="btn btn-light flex-fill " style="" data-bs-dismiss="modal">關閉</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>`);
              $('#standard-modal').modal('show');
          })}"><i class="fa-solid fa-eye fs-6 me-1 "></i>預覽表單</button>
`
        : ``
}
</div>
`;
            }
            switch (dd.elem) {
                case 'selected':
                    html += `<select class="form-select" aria-label="Default select example" style="font-size: 14px;" onchange="
${event((e) => {
    dd.value = $(e).val();
    callback(dd);
})}">
${glitter.print(() => {
    var html = '';
    dd.option.map((d2) => {
        html += ` <option value="${d2.value}" ${d2.value === dd.value ? `selected` : ``}>${d2.name}</option> `;
    });
    return html;
})}
</select>`;
                    break;
                case 'checked':
                    dd.option = glitter.toJson(dd.option, []);
                    dd.option.map((d2) => {
                        var labelID = glitter.getUUID();
                        html += `
                                <div class="py-1  d-flex" style="">
<input class="form-check-input" type="checkbox" role="${dd.role ?? ''}" id="${labelID}" onchange="${event((e) => {
                            if (dd.type === 'single') {
                                dd.option.map((d3) => {
                                    d3.checked = false;
                                });
                            }
                            d2.checked = $(e).get(0).checked;
                            callback(dd);
                            notifyDataChange(id);
                        })}" ${d2.checked ? `checked` : ``} >
${
    d2.elem && d2.checked
        ? `<div style="width: calc(100% - 30px);" class="">${glitter.print(() => {
              if (d2.elem === 'form') {
                  return `
            <label class="ms-1" for="${labelID}" style="font-size: 16px;font-weight: 400;">
 ${d2.name}
  </label>
            ${glitter.share.formEdit.generateFormV2(d2.value, window, callback, true)}`;
              } else {
                  return `<div class="ms-1">${glitter.share.formEdit.generateFormV2([d2], window, callback, true)}</div>`;
              }
          })}</div>`
        : `
<label class="ms-1" for="${labelID}" style="font-size: 16px;font-weight: 400;">
 ${d2.name}
  </label>`
}
  
</div>
                                `;
                    });
                    break;
                case 'form':
                    html += glitter.share.formEdit.generateFormV2(dd.value, window, () => {}, true);
                    break;
                case 'formEdit':
                    html += glitter.share.formEdit.formEditor(dd.value, window, dd.formSetting, false);
                    break;
                case 'input':
                    switch (dd.type) {
                        case 'email':
                            html += `<div class="input-group input-group-merge">
                                              <input class="form-control" type="email"   placeholder="${
                                                  dd.placeholder ?? '請輸入' + dd.name
                                              }" onchange="${event((e) => {
                                dd.value = $(e).val();
                            })}" value="${dd.value ?? ''}" ${dd.readonly ? `readonly` : ``}>
                                           ${
                                               dd.needAuth
                                                   ? ` <div class="btn btn-outline-primary"  onclick="${event((e) => {
                                                         glitter.openDiaLog(
                                                             'dialog/Dia_Check_Mail.html',
                                                             'Dia_Check_Mail',
                                                             false,
                                                             false,
                                                             {
                                                                 mail: dd.value,
                                                                 callback: function (result) {
                                                                     if (result) {
                                                                         glitter.share.dia.success('驗證成功');
                                                                         dd.needAuth = false;
                                                                         notifyDataChange(id);
                                                                     }
                                                                 },
                                                             },
                                                             function () {}
                                                         );
                                                     })}">
                                                <span class="">驗證</span>
                                            </div>`
                                                   : ``
                                           }
                                        </div>`;
                            break;
                        case 'phone':
                            html += `
<div class="input-group input-group-merge">
                                              <input class="form-control" type="email"   placeholder="${
                                                  dd.placeholder ?? '請輸入' + dd.name
                                              }" onchange="${event((e) => {
                                dd.value = $(e).val();
                            })}" value="${dd.value ?? ''}" ${dd.readonly ? `readonly` : ``}>
                                           ${
                                               dd.needAuth
                                                   ? ` <div class="btn btn-outline-primary"  onclick="${event((e) => {
                                                         glitter.openDiaLog(
                                                             'dialog/Dia_Check_Code.html',
                                                             'Dia_Check_Code',
                                                             false,
                                                             false,
                                                             {
                                                                 phone: '+886' + dd.value.substring(1, 10),
                                                                 callback: function (result) {
                                                                     if (result) {
                                                                         glitter.share.dia.success('驗證成功');
                                                                         dd.needAuth = false;
                                                                         notifyDataChange(id);
                                                                     }
                                                                 },
                                                             },
                                                             function () {}
                                                         );
                                                     })}">
                                                <span class="">驗證</span>
                                            </div>`
                                                   : ``
                                           }
                                        </div>`;
                            break;
                        case 'text':
                            html += `
 <div class="w-100 input-group ">
<input type="text" class="form-control w-100"   placeholder="${dd.placeholder ?? '請輸入' + dd.name}" value="${
                                dd.value ?? ''
                            }" onchange="${event((e) => {
                                dd.value = $(e).val();
                                callback(dd);
                                notifyDataChange(id);
                            })}" ${dd.readonly ? `readonly` : ``}>
</div>
                                        `;
                            break;
                        case 'date':
                            var pickerID = glitter.getUUID();
                            html += `
<div class="w-100 input-group " id="${pickerID}">
    <input type="text" placeholder="${
        dd.placeholder ?? '請輸入' + dd.name
    }" class="form-control" data-provide="datepicker" data-date-format="yyyy/mm/dd" data-date-container="#${pickerID}" value="${
                                dd.value ?? ''
                            }" onchange="${event((e) => {
                                dd.value = $(e).val();
                                callback(dd);
                            })}" ${dd.readonly ? `readonly` : ``}>
</div>

                                        `;
                            break;
                        case 'number':
                            html += `
 <div class="w-100 input-group ">
<input type="text" class="form-control w-100"  placeholder="${dd.placeholder ?? '請輸入' + dd.name}" value="${
                                dd.value ?? ''
                            }" onchange="${event((e) => {
                                dd.value = glitter.filterNumber($(e).val());
                                notifyDataChange(id);
                                callback(dd);
                            })}" oninput="${event((e) => {
                                $(e).val(glitter.filterNumber($(e).val()));
                            })}" ${dd.readonly ? `readonly` : ``}>
</div>
                                        `;
                            break;
                        case 'word':
                            html += `
 <div class="w-100 input-group ">
<input type="text" class="form-control w-100"  placeholder="${dd.placeholder ?? '請輸入' + dd.name}" value="${
                                dd.value ?? ''
                            }" onchange="${event((e) => {
                                dd.value = $(e).val().replace(/[\W]/g, '');
                                notifyDataChange(id);
                                callback(dd);
                            })}" oninput="${event((e) => {
                                $(e).val($(e).val().replace(/[\W]/g, ''));
                            })}" ${dd.readonly ? `readonly` : ``}>
</div>
                                        `;
                            break;
                        case 'time':
                            var pickerID = glitter.getUUID();

                            html += `
                                         <div class="mb-3 position-relative">
${bindView({
    bind: pickerID,
    view: () => {
        return ` <div id="pickerID${pickerID}" type="text"    class="form-control"  ${
            dd.readonly ? `readonly` : ``
        } style="" onclick="${event((e) => {
            glitter.openDiaLog('dialog/Dia_Date_Picker.html', 'Dia_Date_Picker', false, false, {
                callback: function (text) {
                    dd.value = text.substring(text);
                    callback(text);
                    notifyDataChange(pickerID);
                },
                data: {
                    date: false,
                    time: true,
                    nowButton: false,
                    clearButton: false,
                    format: 'HH:mm',
                    lang: 'zh-cn',
                },
            });
        })}" >
 ${dd.value ?? `<span style="color: gray"> ${dd.placeholder ?? '請輸入' + dd.name}</span>`}
</div>
`;
    },
    divCreate: { class: `w-100 input-group` },
    onCreate: () => {
        // $(`#pickerID${pickerID}`).timepicker({
        //     showSeconds: false,
        //     icons: {up: "mdi mdi-chevron-up", down: "mdi mdi-chevron-down"},
        //     appendWidgetTo: `#${pickerID}`,
        //     changeTime:()=>{
        //         alert('asas')
        //     }
        // })
    },
})}
                                                </div>
                                        `;
                            break;
                        default:
                            html += `
 <div class="w-100 input-group">
<input type="${dd.type}" class="form-control w-100"   placeholder="${dd.placeholder ?? '請輸入' + dd.name}" value="${
                                dd.value ?? ''
                            }" onchange="${event((e) => {
                                dd.value = $(e).val();
                                notifyDataChange(id);
                                callback(dd);
                            })}" ${dd.readonly ? `readonly` : ``}>
</div>
                                        `;
                    }
                    html += ``;
                    break;
                case 'textArea':
                    html += `<div class="w-100 px-1"><textArea class="form-control border rounded" rows="4"  onchange="${event((e) => {
                        dd.value = $(e).val();
                        callback(dd);
                    })}" placeholder="${dd.placeholder ?? ''}">${dd.value ?? ''}</textArea></div>`;
                    break;
                case 'button':
                    html += `<button class="btn btn-primary" onclick="${event(() => {
                        dd.click(window);
                    })}">${dd.placeholder}</button>`;
                    break;
                default:
                    if (glitter.share.formEdit.extensionItem[dd.elem]) {
                        html += glitter.share.formEdit.extensionItem[dd.elem](dd, window);
                    }
                    break;
            }
            if (index !== data.length - 1) {
                html += `<div class="w-100 my-2 bg-light" style="height: 1px;"></div>`;
            }
        });
        return html;
    },
})}
</div>`;
    },
    //檢查表單是否填寫完畢
    checkFinish: function (data, callback, second) {
        var input1 = data.find(
            (d2) => (d2.elem === 'input' || d2.elem === 'textArea') && (glitter.isEmpty(d2.value) || d2.needAuth) && (second || d2.need)
        );
        var checked = data.find(
            (d2) =>
                d2.elem === 'checked' &&
                !d2.option.find((d3) => {
                    if (d3.checked) {
                        return glitter.share.formEdit.checkFinish([d3], callback, true);
                    } else {
                        return false;
                    }
                }) &&
                d2.need
        );
        if (input1) {
            callback(input1);
            return false;
        } else if (checked) {
            callback(checked);
            return false;
        } else {
            return true;
        }
    },
};
if (!glitter.share.customView) {
    glitter.share.customView = {
        //
        checkYesOrNot: function (title, callback) {
            glitter.openDiaLog(
                'glitterBundle/dialog/Check_Yes_Not.html',
                'Check_Yes_Not',
                false,
                false,
                {
                    title: title,
                    callback: function (result) {
                        callback(result);
                        glitter.closeDiaLogWithTag('Check_Yes_Not');
                    },
                },
                function () {}
            );
        },
    };
}
