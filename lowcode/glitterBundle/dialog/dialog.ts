import { init } from '../GVController.js';
import { Language } from '../../glitter-base/global/language.js';

interface ButtonConfig {
  title: string;
  event: () => void;
}

interface DialogConfig {
  icon?: string;
  content: string;
  cancel?: ButtonConfig;
  confirm?: ButtonConfig;
  width?: number;
  auto?:boolean;
}

interface Bundle {
  width: number;
  type: string;
  obj?: {
    text?: string;
    callback?: (result: boolean) => void;
    BG?: string;
  };
  title?: string;
  callback?: (result: boolean) => void;
  yesString?: string;
  notString?: string;
}

init(import.meta.url, (gvc, glitter, gBundle: Bundle) => {
  const html = String.raw;

  const icons = {
    loading: html` <div class="mt-2"><div class="spinner-border fs-1"></div></div>`,
    success: html`<i class="fa-regular fa-circle-check mb-1" style="font-size: 4rem;"></i>`,
    error: html`<i class="fa-sharp fa-regular fa-circle-xmark mb-1" style="font-size: 4rem;"></i>`,
    info: html`<i class="fa-regular fa-circle-exclamation mb-1" style="font-size: 4rem;"></i>`,
    question: html`<i class="fa-regular fa-circle-question mb-1" style="font-size: 4rem;"></i>`,
  };

  const createButton = (config: ButtonConfig, classes = ''): string => {
    return html`<div class="btn ${classes}" style="font-size: 14px;" onclick="${gvc.event(config.event)}">
      ${config.title}
    </div>`;
  };

  const createDialogBox = (config: DialogConfig): string => html`
    <div class="dialog-box">
      <div class="dialog-content" style="${config.auto ? '' : `width: ${config.width ?? 280}px;`} ">
        ${config.icon ?? ''}
        <div class="mt-3 mb-3 fs-6 text-center w-100" style="white-space: normal;word-break: break-all;">
          ${config.content}
        </div>
        <div class="d-flex gap-3 justify-content-center">
          ${config.cancel ? createButton(config.cancel, 'btn-snow text-dark') : ''}
          ${config.confirm ? createButton(config.confirm, 'btn-black text-white') : ''}
        </div>
      </div>
    </div>
  `;

  gvc.addStyle(`
    .dialog-box {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 10000;
    }
    .dialog-content {
      background: white;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 0.5rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
      color: #393939;
      max-width: 90%;
    }
    .btn-black {
      display: flex;
      padding: 8px 14px;
      max-height: 36px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border: 0;
      border-radius: 10px;
      background: #393939;
      cursor: pointer;
    }
    .btn-black:hover {
      background: #646464 !important;
    }
    .btn-snow {
      display: flex;
      padding: 8px 14px;
      max-height: 36px;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border: 0;
      border-radius: 10px;
      border: 1px solid #ddd;
      background: #fff;
      cursor: pointer;
    }
    .btn-snow:hover {
      background: #d5d5d5;
    }
  `);

  return {
    onCreateView: (): string => {
      try {
        switch (gBundle.type) {
          case 'dataLoading':
            return createDialogBox({
              icon: icons.loading,
              content: gBundle.obj?.text ?? Language.text('please_wait'),
            });

          case 'successMessage':
            setTimeout(() => gvc.closeDialog(), 1200);
            return createDialogBox({
              icon: icons.success,
              content: gBundle.obj?.text ?? Language.text('success'),
            });

          case 'errorMessage':
            return createDialogBox({
              icon: icons.error,
              content: gBundle.obj?.text ?? Language.text('error'),
              cancel: {
                title: Language.text('close'),
                event: () => {
                  gBundle.obj?.callback?.(true);
                  gvc.closeDialog();
                },
              },
            });

          case 'infoMessage':
            return createDialogBox({
              icon: icons.info,
              content: gBundle.obj?.text ?? '系統提示',
              confirm: {
                title: Language.text('okay'),
                event: () => {
                  gBundle.obj?.callback?.(true);
                  gvc.closeDialog()
                }
              },
              width: 420,
            });

          case 'checkYesOrNot':
          case 'warningMessage':
            return createDialogBox({
              icon:  icons.question,
              content: gBundle.title ?? '',
              confirm: {
                title: gBundle.yesString ?? Language.text('okay'),
                event: () => gBundle.callback?.(true),
              },
              cancel: {
                title: gBundle.notString ?? Language.text('cancel'),
                event: () => gBundle.callback?.(false),
              },
              width: 420,
            });

          case 'input_text':
            return createDialogBox({
              content: gBundle.title ?? '',
              confirm: {
                title: Language.text('confirm'),
                event: () => gBundle.callback?.(true),
              },
              cancel: {
                title: Language.text('cancel'),
                event: () => gBundle.callback?.(false),
              },
              width: 420,
            });

          case 'checkYesOrNotWithCustomWidth':
            return createDialogBox({
              icon: icons.info,
              content: gBundle.title ?? '',
              confirm: {
                title: gBundle.yesString ?? Language.text('okay'),
                event: () => gBundle.callback?.(true),
              },
              cancel: {
                title: gBundle.notString ?? Language.text('cancel'),
                event: () => gBundle.callback?.(false),
              },
              width:gBundle.width??600
            });

          default:
            return '';
        }
      } catch (error) {
        console.error('Dialog rendering error:', error);
        return html`<div class="dialog-content">發生錯誤，請稍後再試</div>`;
      }
    },
    onCreate: () => {},
  };
});
