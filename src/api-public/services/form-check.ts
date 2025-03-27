export class FormCheck {
  static initialRegisterForm(form_formats: any[]) {
    //沒有姓名欄位
    if (
      !form_formats.find((dd: any) => {
        return dd.key === 'name';
      })
    ) {
      form_formats.push({
        col: '12',
        key: 'name',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: '姓名',
        col_sm: '12',
        toggle: false,
        appName: 'cms_system',
        require: true,
        readonly: 'write',
        formFormat: '{}',
        style_data: {
          input: {
            list: [],
            class: '',
            style: '',
            version: 'v2',
          },
          label: {
            list: [],
            class: 'form-label fs-base ',
            style: '',
            version: 'v2',
          },
          container: {
            list: [],
            class: '',
            style: '',
            version: 'v2',
          },
        },
        form_config: {
          type: 'text',
          title: '',
          input_style: {
            list: [],
            version: 'v2',
          },
          title_style: {
            list: [],
            version: 'v2',
          },
          place_holder: '請輸入姓名',
        },
        deletable: false,
      });
    }
    //沒有信箱欄位
    if (
      !form_formats.find((dd: any) => {
        return dd.key === 'email';
      })
    ) {
      form_formats.push({
        col: '12',
        key: 'email',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: '信箱 / 帳號',
        col_sm: '12',
        toggle: false,
        appName: 'cms_system',
        require: true,
        readonly: 'write',
        formFormat: '{}',
        style_data: {
          input: {
            list: [],
            class: '',
            style: '',
            version: 'v2',
          },
          label: {
            list: [],
            class: 'form-label fs-base ',
            style: '',
            version: 'v2',
          },
          container: {
            list: [],
            class: '',
            style: '',
            version: 'v2',
          },
        },
        form_config: {
          type: 'email',
          title: '',
          input_style: {
            list: [],
            version: 'v2',
          },
          title_style: {
            list: [],
            version: 'v2',
          },
          place_holder: '請輸入電子信箱',
        },
        deletable: false,
      });
    }
    //沒有電話欄位
    if (
      !form_formats.find((dd: any) => {
        return dd.key === 'phone';
      })
    ) {
      form_formats.push({
        col: '12',
        key: 'phone',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: '手機',
        col_sm: '12',
        toggle: false,
        appName: 'cms_system',
        require: false,
        readonly: 'write',
        formFormat: '{}',
        style_data: {
          input: {
            list: [],
            class: '',
            style: '',
            version: 'v2',
          },
          label: {
            list: [],
            class: 'form-label fs-base ',
            style: '',
            version: 'v2',
          },
          container: {
            list: [],
            class: '',
            style: '',
            version: 'v2',
          },
        },
        form_config: {
          type: 'phone',
          title: '',
          input_style: {
            list: [],
            version: 'v2',
          },
          title_style: {
            list: [],
            version: 'v2',
          },
          place_holder: '請輸入手機號碼',
        },
        deletable: false,
      });
    }
    //沒有生日欄位
    if (
      !form_formats.find((dd: any) => {
        return dd.key === 'birth';
      })
    ) {
      form_formats.push({
        col: '12',
        key: 'birth',
        page: 'input',
        type: 'form_plugin_v2',
        group: '',
        title: '生日',
        col_sm: '12',
        toggle: false,
        appName: 'cms_system',
        require: true,
        readonly: 'write',
        formFormat: '{}',
        style_data: {
          input: {
            list: [],
            class: '',
            style: '',
            version: 'v2',
          },
          label: {
            list: [],
            class: 'form-label fs-base ',
            style: '',
            version: 'v2',
          },
          container: {
            list: [],
            class: '',
            style: '',
            version: 'v2',
          },
        },
        form_config: {
          type: 'date',
          title: '',
          input_style: {
            list: [],
            version: 'v2',
          },
          title_style: {
            list: [],
            version: 'v2',
          },
          place_holder: '請輸入你的出生日期',
        },
        deletable: false,
      });
    }
  }

  static initialUserForm(form_formats: any[]) {
    //沒有姓名欄位
    const userObject = [
      { key: 'carrier_number', title: '手機載具' },
      { key: 'gui_number', title: '統一編號' },
      { key: 'company', title: '公司' },
      { key: 'consignee_name', title: '收貨人', type: 'consignee' },
      { key: 'consignee_address', title: '收貨人地址', type: 'consignee' },
      { key: 'consignee_email', title: '收貨人電子郵件', type: 'consignee' },
      { key: 'consignee_phone', title: '收貨人手機', type: 'consignee' },
    ];

    userObject.map(item => {
      if (
        !form_formats.find((dd: any) => {
          return dd.key === item.key;
        })
      ) {
        form_formats.push({
          col: '12',
          key: item.key,
          page: 'input',
          type: 'form_plugin_v2',
          group: '',
          title: item.title,
          col_sm: '12',
          toggle: false,
          appName: 'cms_system',
          require: false,
          readonly: 'write',
          formFormat: '{}',
          style_data: {
            input: {
              list: [],
              class: '',
              style: '',
              version: 'v2',
            },
            label: {
              list: [],
              class: 'form-label fs-base ',
              style: '',
              version: 'v2',
            },
            container: {
              list: [],
              class: '',
              style: '',
              version: 'v2',
            },
          },
          form_config: {
            type: item.type ?? 'text',
            title: '',
            input_style: {
              list: [],
              version: 'v2',
            },
            title_style: {
              list: [],
              version: 'v2',
            },
            place_holder: '',
          },
          deletable: false,
        });
      }
    });

    return form_formats;
  }

  static initialListHeader(data?: any) {
    data = data || {};
    data['user-list'] ??= [
      '顧客名稱',
      '電子信箱',
      '訂單',
      '會員等級',
      '累積消費',
      '上次登入時間',
      '社群綁定',
      '用戶狀態',
    ];
    data['order-list'] ??= ['訂單編號', '訂單日期', '訂購人', '訂單金額', '付款狀態', '出貨狀態', '訂單狀態'];
    return data;
  }

  static initialLoginConfig(data?: any) {
    data = {
      sorted_voucher: {
        toggle: false,
        array: [],
      },
      ...(data ?? {}),
    };
    return data;
  }
}
