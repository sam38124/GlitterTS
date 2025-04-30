import { GVC } from '../glitterBundle/GVController.js';
import { ShareDialog } from '../glitterBundle/dialog/ShareDialog.js';
import { ShoppingDiscountSetting } from './shopping-discount-setting.js';
import { ApiUser } from '../glitter-base/route/user.js';
import { FilterOptions } from './filter-options.js';
import { BgWidget } from '../backend-manager/bg-widget.js';
import { EditorElem } from '../glitterBundle/plugins/editor-elem.js';
import { ApiFcm } from '../glitter-base/route/fcm.js';

const html = String.raw;

interface EmailObject {
  id: number;
}

type PostData = {
  type: 'notify-fcm-config';
  tag: string;
  tagList: { tag: string; filter: any; valueString: string }[];
  userList: EmailObject[];
  name: string;
  boolean: 'and' | 'or';
  title: string;
  content: string;
  link: string;
  sendTime: { date: string; time: string } | undefined;
  sendGroup: string[];
  email?: string[];
  phone?: string[];
  typeName?: string;
};
const inputStyle = 'font-size: 16px; height:40px; width:300px;';

export class AutoFcmAdvertise {
  static main(gvc: GVC) {
    const glitter = gvc.glitter;
    const dialog = new ShareDialog(gvc.glitter);
    const startDate = ShoppingDiscountSetting.getDateTime(1).date;
    const startTime = ShoppingDiscountSetting.getDateTime(1).time;
    const vm = {
      id: glitter.getUUID(),
      containerId: glitter.getUUID(),
      emailId: glitter.getUUID(),
      tagsId: glitter.getUUID(),
      loading: true,
      dataList: [] as { key: string; value: string }[],
    };
    const postData: PostData = {
      type: 'notify-fcm-config',
      tag: '',
      tagList: [],
      userList: [],
      boolean: 'or',
      name: '',
      title: '',
      link: '',
      content: '',
      sendTime: { date: startDate, time: startTime },
      sendGroup: [],
    };

    async function getOptions(tag: string) {
      if (tag === 'level') {
        return await ApiUser.getPublicConfig('member_level_config', 'manager').then((res: any) => {
          if (res.result && res.response.value && res.response.value.levels.length > 0) {
            return res.response.value.levels.map((data: any) => {
              return { key: data.id, value: data.tag_name };
            });
          }
          return [];
        });
      }
      if (tag === 'tags') {
        return await ApiUser.getPublicConfig('user_general_tags', 'manager').then((res: any) => {
          if (res.result && res.response.value && res.response.value.list.length > 0) {
            return res.response.value.list.map((data: any) => {
              return { key: data, value: data };
            });
          }
          return [];
        });
      }
      if (tag === 'group') {
        return await ApiUser.getUserGroupList().then((res: any) => {
          if (res.result) {
            return res.response.data
              .filter((data: { type: string }) => {
                return data.type !== 'level';
              })
              .map((data: { type: string; title: string }) => {
                return { key: data.type, value: data.title };
              });
          }
          return [];
        });
      }
      if (tag === 'birth') {
        const userFunnel = await FilterOptions.getUserFunnel();
        const birthData = userFunnel.find(data => data.key === 'birth');
        if (birthData && Array.isArray(birthData.data)) {
          return birthData.data.map((item: any) => {
            item.value = item.name;
            return item;
          });
        }
      }
      return [];
    }

    function filterEvent(filter: any) {
      if (filter.length === 0) {
        postData.tagList = postData.tagList.filter(data => data.tag !== postData.tag);
      } else {
        let valueString = '';
        if (postData.tag === 'all') {
          valueString = '';
        } else if (Array.isArray(filter)) {
          valueString = vm.dataList
            .filter(data => {
              return filter.includes(data.key);
            })
            .map(data => {
              return data.value;
            })
            .join(', ');
        } else {
          const intFiltter = parseInt(`${filter}`, 10);
          filter = intFiltter > 0 ? intFiltter : 0;
          valueString = filter;
        }

        const index = postData.tagList.findIndex(data => data.tag === postData.tag);
        if (index === -1) {
          postData.tagList.push({ tag: postData.tag, filter: filter, valueString });
        } else {
          postData.tagList[index] = { tag: postData.tag, filter: filter, valueString };
        }
      }
      setUserList();
    }

    function filterEmails(emails: EmailObject[], mode: 'or' | 'and', n?: number): EmailObject[] {
      if (mode === 'or') {
        // 使用 Set 來移除重複的 id
        const uniqueIds = new Set<number>();
        return emails.filter(emailObj => {
          if (!uniqueIds.has(emailObj.id)) {
            uniqueIds.add(emailObj.id);
            return true;
          }
          return false;
        });
      } else if (mode === 'and' && n && n > 0) {
        // 計算每個 id 出現的次數
        const frequencyMap: { [key: number]: { count: number; emailObj: EmailObject } } = {};
        emails.forEach(emailObj => {
          if (frequencyMap[emailObj.id]) {
            frequencyMap[emailObj.id].count += 1;
          } else {
            frequencyMap[emailObj.id] = { count: 1, emailObj };
          }
        });
        // 篩選出出現次數大於或等於 n 的 id
        return Object.values(frequencyMap)
          .filter(entry => entry.count >= n)
          .map(entry => entry.emailObj);
      }
      return [];
    }

    function setUserList() {
      let n = 0;
      postData.userList = [];
      dialog.dataLoading({ visible: true, text: '更新預計寄件人...' });

      new Promise<void>(resolve => {
        const si = setInterval(() => {
          if (postData.tagList.length === n) {
            resolve();
            clearInterval(si);
          }
        }, 200);
        postData.tagList.map(tagData => {
          if (tagData.tag === 'all') {
            ApiUser.getUserList({
              page: 0,
              limit: 99999,
              only_id: true,
            }).then(dd => {
              dd.response.data.map((user: any) => {
                postData.userList.push({
                  id: user.userID,
                });
              });
              n++;
            });
          }
          if (tagData.tag === 'customers') {
            ApiUser.getUserList({
              page: 0,
              limit: 99999,
              id: tagData.filter.join(','),
            }).then(dd => {
              dd.response.data.map((user: any) => {
                postData.userList.push({
                  id: user.userID,
                });
              });
              n++;
            });
          }
          if (tagData.tag === 'level') {
            let n1 = 0;
            new Promise<EmailObject[]>(resolve => {
              const list: EmailObject[] = [];
              tagData.filter.map((id: string) => {
                ApiUser.getUserListOrders({
                  page: 0,
                  limit: 99999,
                  group: { type: 'level', tag: id },
                }).then(data => {
                  data.response.data.map((user: any) => {
                    list.push({
                      id: user.userID,
                    });
                  });
                  n1++;
                });
                const si = setInterval(() => {
                  if (tagData.filter.length === n1) {
                    resolve(filterEmails(list, 'or'));
                    clearInterval(si);
                  }
                }, 200);
              });
            }).then(res => {
              postData.userList = postData.userList.concat(res);
              n++;
            });
          }
          if (tagData.tag === 'group') {
            let n2 = 0;
            const list: EmailObject[] = [];
            new Promise<EmailObject[]>(resolve => {
              tagData.filter.map((type: string) => {
                ApiUser.getUserListOrders({
                  page: 0,
                  limit: 99999,
                  group: { type: type },
                }).then(data => {
                  // 加入額外的會員資料，例如有訂閱但未註冊者
                  let dataArray = data.response.data;
                  if (data.response.extra) {
                    dataArray = dataArray.concat(data.response.extra.noRegisterUsers);
                  }
                  dataArray.map((user: any) => {
                    list.push({
                      id: user.userID,
                    });
                  });
                  n2++;
                });
                const si = setInterval(() => {
                  if (tagData.filter.length === n2) {
                    resolve(filterEmails(list, 'or'));
                    clearInterval(si);
                  }
                }, 200);
              });
            }).then(res => {
              postData.userList = postData.userList.concat(res);
              n++;
            });
          }
          if (tagData.tag === 'birth') {
            ApiUser.getUserListOrders({
              page: 0,
              limit: 99999,
              filter: { birth: tagData.filter },
            }).then(data => {
              data.response.data.map((user: any) => {
                postData.userList.push({
                  id: user.userID,
                });
              });
              n++;
            });
          }
          if (tagData.tag === 'tags') {
            ApiUser.getUserListOrders({
              page: 0,
              limit: 99999,
              filter: { tags: tagData.filter },
            }).then(data => {
              data.response.data.map((user: any) => {
                postData.userList.push({
                  id: user.userID,
                });
              });
              n++;
            });
          }
          if (tagData.tag === 'expiry') {
          }
          if (tagData.tag === 'remain') {
            ApiUser.getUserListOrders({
              page: 0,
              limit: 99999,
              filter: { rebate: { key: 'moreThan', value: tagData.filter } },
            }).then(data => {
              data.response.data.map((user: any) => {
                postData.userList.push({
                  id: user.userID,
                });
              });
              n++;
            });
          }
          if (tagData.tag === 'uncheckout') {
          }
        });
      }).then(() => {
        postData.userList = filterEmails(
          postData.userList,
          postData.boolean,
          postData.boolean === 'and' ? postData.tagList.length : undefined
        );
        dialog.dataLoading({ visible: false });
        gvc.notifyDataChange(vm.tagsId);
      });
    }

    function tagBadge(key: string, name: string, value: string) {
      const formatName = value && value.length > 0 ? `${name}：${value}` : name;
      return {
        name: formatName,
        html: html` <div class="c_filter_tag">
          ${formatName}
          <i
            class="fa-solid fa-xmark ms-1"
            style="cursor: pointer"
            onclick="${gvc.event(() => {
              postData.tagList = postData.tagList.filter(data => data.tag !== key);
              setUserList();
              gvc.notifyDataChange(vm.tagsId);
            })}"
          ></i>
        </div>`,
      };
    }

    function getTagsHTML() {
      const badgeList: { name: string; html: string }[] = [];
      postData.tagList.map(data => {
        const opt = FilterOptions.emailOptions.find(item => item.key === data.tag);
        if (opt) {
          if (!Array.isArray(data.filter)) {
            switch (data.tag) {
              case 'remain':
                data.valueString = `大於${data.filter}點`;
                break;
            }
          }
          badgeList.push(tagBadge(data.tag, opt.value, data.valueString));
        }
      });
      postData.sendGroup = badgeList.map(item => item.name);
      return [
        html` <div class="tx_normal fw-normal">標籤判斷</div>
          ${BgWidget.grayNote('當有多個篩選條件時，進階判斷顧客符合的交集')}
          <div style="margin: 8px 0;">
            ${BgWidget.switchTextButton(gvc, postData.boolean === 'and', { left: '或', right: '且' }, bool => {
              postData.boolean = bool ? 'and' : 'or';
              setUserList();
              gvc.notifyDataChange(vm.tagsId);
            })}
          </div>`,
        html`
          <div class="tx_normal fw-normal">預計寄件顧客人數</div>
          <div style="display:flex; align-items: center; gap: 18px; margin: 8px 0;">
            <div class="tx_normal">${postData.userList.length}人</div>
            ${BgWidget.grayButton(
              '查看名單',
              gvc.event(() => {
                if (postData.userList.length === 0) {
                  const dialog = new ShareDialog(gvc.glitter);
                  dialog.infoMessage({ text: '目前無預計寄件的顧客' });
                  return;
                }
                const userVM = {
                  dataList: [] as { key: string; value: string; note: string }[],
                };
                BgWidget.selectDropDialog({
                  gvc: gvc,
                  title: '預計寄件顧客',
                  tag: 'send_users_list',
                  callback: () => {},
                  default: [],
                  api: () => {
                    return new Promise(resolve => {
                      ApiUser.getUserListOrders({
                        page: 0,
                        limit: 99999,
                        id: postData.userList.map(user => user.id ?? 0).join(','),
                      }).then(dd => {
                        if (dd.response.data) {
                          userVM.dataList = dd.response.data.map(
                            (item: { userID: number; userData: { name: string; email: string } }) => {
                              return {
                                key: item.userID,
                                value: item.userData.name,
                                note: item.userData.email,
                              };
                            }
                          );
                          resolve(userVM.dataList);
                        }
                      });
                    });
                  },
                  style: 'width: 100%;',
                  readonly: true,
                });
              }),
              { textStyle: 'font-weight: 400;' }
            )}
          </div>
        `,
        html`
          <div class="tx_normal fw-normal">篩選條件</div>
          <div class="c_filter_container">
            ${badgeList.length === 0
              ? '無'
              : badgeList
                  .map(item => {
                    return item.html;
                  })
                  .join(postData.boolean === 'and' ? '且' : '或')}
          </div>
        `,
      ].join(BgWidget.mbContainer(18));
    }

    return html` <div class="title-container">
        ${BgWidget.title('手動寄件')}
        <div class="flex-fill"></div>
      </div>
      ${BgWidget.mbContainer(18)}
      ${BgWidget.container(
        gvc.bindView(() => {
          return {
            bind: vm.containerId,
            view: () => {
              return (
                [
                  BgWidget.mainCard(
                    [
                      html` <div class="tx_700">選擇收件對象</div>`,
                      html` <div class="tx_normal fw-normal mt-3">根據</div>`,
                      html` <div
                        style="display: flex; ${document.body.clientWidth > 768
                          ? 'gap: 18px;'
                          : 'flex-direction: column;'}"
                      >
                        <div style="width: ${document.body.clientWidth > 768 ? '400px' : '100%'};">
                          ${BgWidget.select({
                            gvc: gvc,
                            default: postData.tag,
                            callback: key => {
                              postData.tag = key;
                              vm.loading = true;
                              gvc.notifyDataChange(vm.id);
                            },
                            options: FilterOptions.emailOptions,
                            style: 'margin: 8px 0;',
                          })}
                        </div>
                        <div style="width: 100%; display: flex; align-items: center;">
                          ${gvc.bindView({
                            bind: vm.id,
                            view: () => {
                              const getDefault = (def: any) => {
                                const data = postData.tagList.find(data => data.tag === postData.tag);
                                return data ? data.filter : def;
                              };
                              const callback = (value?: any) => {
                                if (typeof value === 'string' || typeof value === 'number') {
                                  const intFiltter = parseInt(`${value}`, 10);
                                  value = intFiltter > 0 ? intFiltter : 0;
                                  if (isNaN(intFiltter) || intFiltter < 0) {
                                    const dialog = new ShareDialog(gvc.glitter);
                                    dialog.infoMessage({ text: '請輸入正整數或0' });
                                    return;
                                  }
                                }
                                filterEvent(value);
                              };
                              switch (postData.tag) {
                                case 'all':
                                  dialog.dataLoading({ visible: true, text: '取得所有會員資料中...' });
                                  new Promise(resolve => {
                                    ApiUser.getUserList({
                                      page: 0,
                                      limit: 99999,
                                      only_id: true,
                                    }).then(dd => {
                                      if (dd.response.data) {
                                        const ids: number[] = [];
                                        vm.dataList = dd.response.data
                                          .filter((item: { userData: { email: string } }) => {
                                            return item.userData.email && item.userData.email.length > 0;
                                          })
                                          .map(
                                            (item: { userID: number; userData: { name: string; email: string } }) => {
                                              ids.push(item.userID);
                                              return {
                                                key: item.userID,
                                                value: item.userData.name ?? '（尚無姓名）',
                                                note: item.userData.email,
                                              };
                                            }
                                          );
                                        resolve(ids);
                                      }
                                    });
                                  }).then(data => {
                                    dialog.dataLoading({ visible: false });
                                    callback(data);
                                  });
                                  return '';
                                case 'level':
                                case 'group':
                                case 'birth':
                                case 'tags':
                                  return BgWidget.selectDropList({
                                    gvc: gvc,
                                    callback: callback,
                                    default: getDefault([]),
                                    options: vm.loading ? [] : vm.dataList,
                                    placeholder: vm.loading ? '資料載入中...' : undefined,
                                    style: 'margin: 8px 0; width: 100%;',
                                  });
                                case 'customers':
                                  return BgWidget.grayButton(
                                    '點擊選取顧客',
                                    gvc.event(() => {
                                      BgWidget.selectDropDialog({
                                        gvc: gvc,
                                        title: '搜尋特定顧客',
                                        tag: 'set_send_users',
                                        updownOptions: FilterOptions.userOrderBy,
                                        callback: callback,
                                        default: getDefault([]),
                                        api: (data: { query: string; orderString: string }) => {
                                          return new Promise(resolve => {
                                            ApiUser.getUserList({
                                              page: 0,
                                              limit: 99999,
                                              only_id: true,
                                              search: data.query,
                                            }).then(dd => {
                                              if (dd.response.data) {
                                                vm.dataList = dd.response.data
                                                  .filter((item: { userData: { email: string } }) => {
                                                    return item.userData.email && item.userData.email.length > 0;
                                                  })
                                                  .map(
                                                    (item: {
                                                      userID: number;
                                                      userData: { name: string; email: string };
                                                    }) => {
                                                      return {
                                                        key: item.userID,
                                                        value: item.userData.name ?? '（尚無姓名）',
                                                        note: item.userData.email,
                                                      };
                                                    }
                                                  );
                                                resolve(vm.dataList);
                                              }
                                            });
                                          });
                                        },
                                        style: 'width: 100%;',
                                      });
                                    }),
                                    { textStyle: 'font-weight: 400;' }
                                  );
                                case 'expiry':
                                  return BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    default: getDefault('0'),
                                    placeHolder: '請輸入剩餘多少天',
                                    callback: callback,
                                    endText: '天',
                                  });
                                case 'remain':
                                  return BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    default: getDefault('0'),
                                    placeHolder: '請輸入大於多少',
                                    callback: callback,
                                    startText: '大於',
                                    endText: '點',
                                  });
                                case 'uncheckout':
                                  return BgWidget.editeInput({
                                    gvc: gvc,
                                    title: '',
                                    default: getDefault('0'),
                                    placeHolder: '請輸入超過幾天未結帳',
                                    callback: callback,
                                    endText: '天',
                                  });
                                default:
                                  return '';
                              }
                            },
                            divCreate: { class: 'w-100' },
                            onCreate: () => {
                              if (vm.loading) {
                                getOptions(postData.tag).then(opts => {
                                  vm.dataList = opts as { key: string; value: string }[];
                                  vm.loading = false;
                                  gvc.notifyDataChange(vm.id);
                                });
                              }
                            },
                          })}
                        </div>
                      </div>`,
                      gvc.bindView({
                        bind: vm.tagsId,
                        view: () => getTagsHTML(),
                        divCreate: { style: 'margin-top: 8px;' },
                      }),
                    ].join('')
                  ),
                  BgWidget.mainCard(
                    [
                      html` <div class="tx_700">推播內容</div>`,
                      gvc.bindView({
                        bind: vm.emailId,
                        view: () => {
                          return [
                            BgWidget.editeInput({
                              gvc: gvc,
                              title: '推播標題',
                              default: postData.title,
                              placeHolder: '請輸入推播標題',
                              callback: text => {
                                postData.title = text;
                              },
                              global_language: true,
                            }),
                            BgWidget.editeInput({
                              gvc: gvc,
                              title: '推播內文',
                              default: postData.content,
                              placeHolder: '請輸入推播內文',
                              callback: text => {
                                postData.content = text;
                              },
                              global_language: true,
                            }),
                            BgWidget.linkList({
                              gvc: gvc,
                              title: '跳轉頁面',
                              default: postData.link || '',
                              placeHolder: '為空則為首頁',
                              callback: text => {
                                postData.link = text;
                              },
                            }),
                          ].join('');
                        },
                        divCreate: {
                          class: 'mt-2',
                        },
                      }),
                    ].join('')
                  ),
                  BgWidget.mainCard(
                    html` <div class="tx_700 mb-3">發送時間</div>
                      ${EditorElem.radio({
                        gvc: gvc,
                        title: '',
                        def: postData.sendTime === undefined ? 'now' : 'set',
                        array: [
                          {
                            title: '立即發送',
                            value: 'now',
                          },
                          {
                            title: '排定發送時間',
                            value: 'set',
                            innerHtml: html` <div
                              class="d-flex mt-3 ${document.body.clientWidth < 768 ? 'flex-column' : ''}"
                              style="gap: 12px"
                            >
                              ${EditorElem.editeInput({
                                gvc: gvc,
                                title: '',
                                type: 'date',
                                style: inputStyle,
                                default: startDate,
                                placeHolder: '',
                                callback: date => {
                                  postData.sendTime = {
                                    date: date,
                                    time: postData.sendTime?.time ?? '',
                                  };
                                },
                              })}
                              ${EditorElem.editeInput({
                                gvc: gvc,
                                title: '',
                                type: 'time',
                                style: inputStyle,
                                default: startTime,
                                placeHolder: '',
                                callback: time => {
                                  postData.sendTime = {
                                    date: postData.sendTime?.date ?? '',
                                    time: time,
                                  };
                                },
                              })}
                            </div>`,
                          },
                        ],
                        callback: text => {
                          if (text === 'now') {
                            postData.sendTime = undefined;
                          }
                          if (text === 'set') {
                            postData.sendTime = { date: startDate, time: startTime };
                          }
                        },
                      })}`
                  ),
                ].join(BgWidget.mbContainer(16)) + BgWidget.mbContainer(240)
              );
            },
          };
        })
      )}
      ${BgWidget.mbContainer(480)}
      <div class="update-bar-container">
        ${BgWidget.save(
          gvc.event(() => {
            function isLater(dateTimeObj: { date: string; time: string }) {
              const currentDateTime = new Date();
              const { date, time } = dateTimeObj;
              const dateTimeString = `${date}T${time}:00`;
              const providedDateTime = new Date(dateTimeString);
              return currentDateTime > providedDateTime;
            }

            if (postData.sendTime && isLater(postData.sendTime)) {
              dialog.errorMessage({ text: '排定發送的時間需大於現在時間' });
              return;
            }

            if (postData.userList.length == 0) {
              dialog.errorMessage({ text: '請選擇發送對象' });
              return;
            }

            dialog.dataLoading({
              text: postData.sendTime ? '信件排定中...' : '信件發送中...',
              visible: true,
            });
            ApiFcm.send(postData).then(data => {
              dialog.dataLoading({ visible: false });
              if (data.result) {
                dialog.successMessage({
                  text: postData.sendTime ? '排定成功' : '發送成功',
                });
              } else {
                dialog.errorMessage({ text: '手動寄件失敗' });
              }
            });
          }),
          '送出'
        )}
      </div>`;
  }
}

function defaultEmailText() {
  return `親愛的 [使用者名稱],

    歡迎來到 [你的公司或社群名稱]！我們很高興你選擇了我們，並成為我們社群的一員。
    
    在這裡，我們致力於提供 [描述你的服務或社群的價值]。我們的團隊一直在努力讓你有一個令人愉快和有價值的體驗。
    
    以下是一些建議的下一步：
    
    1. **完善個人資料：** 請登入您的帳戶，完善您的個人資料，這有助於我們更好地瞭解您的需求。
    
    2. **參與社群：** 加入我們的社交媒體，訂閱我們的通訊，參與我們的討論，您將有機會與其他社群成員建立聯繫。
    
    3. **探索我們的服務：** 探索我們的網站/應用程式，瞭解我們提供的所有功能和服務。
    
    如果您在使用過程中遇到任何問題，或者有任何反饋，請隨時與我們聯繫。我們的支援團隊隨時準備協助您。
    
    再次感謝您加入 [你的公司或社群名稱]，我們期待與您建立長期的合作關係！
    
    祝您有美好的一天！
    
    最誠摯的問候，
    
    [你的名稱]
    [你的職務]
    [你的公司或社群名稱]
    [聯絡電子郵件]
    [聯絡電話]`.replace(/\n/g, `<br>`);
}

(window as any).glitter.setModule(import.meta.url, AutoFcmAdvertise);
