import { GVC } from '../../glitterBundle/GVController.js';

export class InputCustom {
  public static main(obj: { gvc: GVC; widget: any; subData: any }) {
    const html = String.raw;
    const glitter = obj.gvc.glitter;
    const widget = obj.widget;
    const gvc = obj.gvc;
    let [type, place_holder, value, min, max] = [
      (() => {
        return widget.bundle.form_config['type'];
      })(),
      (() => {
        try {
          return glitter.share.LanguageApi.getLanguageCustomText(widget.bundle.form_config['place_holder']);
        } catch {
          return `error`;
        }
      })(),
      (() => {
        try {
          if (widget.bundle.form_config['type'] == 'color' && !widget.bundle.form_data[widget.bundle.form_key]) {
            widget.bundle.form_data[widget.bundle.form_key] = '#000000';
          }
          return widget.bundle.form_data[widget.bundle.form_key] || '';
        } catch {
          return ``;
        }
      })(),
      (() => {
        if (widget.bundle.form_config.start_time) {
          const date = new Date();

          date.setDate(date.getDate() - parseInt(widget.bundle.form_config.start_time, 10));
          return glitter.ut.dateFormat(date, 'yyyy-MM-dd');
        } else {
          return ``;
        }
      })(),
      (() => {
        if (widget.bundle.form_config.end_time) {
          const date = new Date();

          date.setDate(date.getDate() + parseInt(widget.bundle.form_config.end_time, 10));
          return glitter.ut.dateFormat(date, 'yyyy-MM-dd');
        } else {
          return ``;
        }
      })(),
    ];

    return gvc.bindView(() => {
      const id = gvc.glitter.getUUID();
      const input_id = gvc.glitter.getUUID();
      return {
        bind: id,
        view: () => {
          return html`
            <div
              class="${(() => {
                try {
                  return (
                    gvc.glitter.htmlGenerate
                      .styleEditor(widget.bundle.form_config['title_style'], gvc, widget)
                      .class()
                      .trim() || `fw-normal mt-2 fs-6`
                  );
                } catch {
                  return `fw-normal mt-2 fs-6`;
                }
              })()}"
              style="${(() => {
                try {
                  return (
                    gvc.glitter.htmlGenerate
                      .styleEditor(widget.bundle.form_config['title_style'], gvc, widget)
                      .style()
                      .trim() ||
                    `color: black;
margin-bottom: 5px;
white-space: normal;`
                  );
                } catch {
                  return `color: black;
margin-bottom: 5px;
white-space: normal;`;
                }
              })()}"
            >
              ${(() => {
                try {
                  return glitter.share.LanguageApi.getLanguageCustomText(widget.bundle.form_title || 'title');
                } catch {
                  return 'title';
                }
              })()}
            </div>
            <input class="${(() => {
              try {
                return (
                  gvc.glitter.htmlGenerate
                    .styleEditor(widget.bundle.form_config['input_style'], gvc, widget)
                    .class()
                    .trim() || 'form-control'
                );
              } catch {
                return `form-control`;
              }
            })()}" style="${(() => {
              try {
                return (
                  gvc.glitter.htmlGenerate
                    .styleEditor(widget.bundle.form_config['input_style'], gvc, widget)
                    .style()
                    .trim() || 'form-control'
                );
              } catch {
                return `form-control`;
              }
            })()}" value="${value}"
                   placeholder="${place_holder}"
                   type="${type==='date'?'text':type}"
                   id="${input_id}" onchange="${gvc.event((e, event) => {
                     widget.bundle.form_data[widget.bundle.form_key] = e.value;
                     widget.bundle.refresh && widget.bundle.refresh();
                   })}" > </input>`;
        },
        divCreate: {},
        onCreate: () => {
          if (type === 'date') {
            gvc.glitter.addStyleLink(['https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css']);
            gvc.glitter.addMtScript(
              [
                'https://cdn.jsdelivr.net/npm/flatpickr',
                new URL('./jslib/picker-zh-tw.js', gvc.glitter.root_path).href,
              ],
              () => {
                const cf: any = {
                  locale: 'zh', // locale for this instance only,
                  disableMobile: "true"
                };
                if (min) {
                  cf.minDate = new Date(`${min} 00:00:00`);
                }
                if (max) {
                  cf.maxDate = new Date(`${max} 23:59:59`);
                }
                console.log(`cf===>`,cf)
                //@ts-ignore
                let fp = flatpickr('#' + input_id, cf);
                if(min){
                  if(value && (new Date(value).getTime() < new Date(min).getTime())   ){
                    widget.bundle.form_data[widget.bundle.form_key] = '';
                    value=''
                    gvc.notifyDataChange(id)
                  }
                }
                if(max){
                  if(value && (new Date(value).getTime() > new Date(`${max} 23:59:59`).getTime())   ){
                    widget.bundle.form_data[widget.bundle.form_key] = '';
                    value=''
                    gvc.notifyDataChange(id)
                  }
                }

              },
              () => {}
            );
          }else if(type === 'time'){
            gvc.glitter.addStyleLink(['https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css']);
            gvc.glitter.addMtScript(
              [
                'https://cdn.jsdelivr.net/npm/flatpickr',
                new URL('./jslib/picker-zh-tw.js', gvc.glitter.root_path).href,
              ],
              () => {
                const cf: any = {
                  locale: 'zh', // locale for this instance only,
                  disableMobile: "true",
                  noCalendar: true,
                  enableTime: true,
                  dateFormat: 'H:i'
                };
                //@ts-ignore
                let fp = flatpickr('#' + input_id, cf);


              },
              () => {}
            );
          }
        },
      };
    });
  }
}

(window as any).glitter.setModule(import.meta.url, InputCustom);
