import { Glitter } from '../Glitter.js';


interface DataLoadingOptions {
  text?: string;
  visible: boolean;
  BG?: string;
}

interface MessageOptions {
  text?: string;
  callback?: () => void;
}

interface ErrorMessageOptions extends MessageOptions {
  tag?: string;
  callback?: () => void;
}

interface ConfirmDialogOptions {
  text: string;
  callback: (response: boolean) => void;
  icon?: string;
  yesString?: string;
  notString?: string;
}


export class ShareDialog {
  public dataLoading: (obj: DataLoadingOptions) => void;
  public infoMessage: (obj: MessageOptions) => void;
  public errorMessage: (obj: ErrorMessageOptions) => void;
  public successMessage: (obj: MessageOptions) => void;
  public warningMessage: (obj: ConfirmDialogOptions) => void;
  public checkYesOrNot: (obj: ConfirmDialogOptions) => void;
  public confirmMessage: (obj: ConfirmDialogOptions) => void;
  public checkYesOrNotWithCustomWidth: (obj: ConfirmDialogOptions) => void;
  public customCheck: (obj: ConfirmDialogOptions) => void;

  constructor(private glitter: Glitter) {
    if (glitter.getUrlParameter('cms') === 'true' || glitter.getUrlParameter('type') === 'htmlEditor') {
      this.glitter = (window.parent as any).glitter;
    }
    this.dataLoading = (obj: DataLoadingOptions): void => {
      if (obj.visible) {
        this.glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'dataLoading', {
          type: 'dataLoading',
          obj,
        },);
      } else {
        this.glitter.closeDiaLog('dataLoading');
      }
    };

    this.infoMessage = (obj: MessageOptions): void => {
      this.glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'infoMessage', {
        type: 'infoMessage',
        obj,
      },);
    };

    this.errorMessage = (obj: ErrorMessageOptions): void => {
      this.glitter.openDiaLog('glitterBundle/dialog/dialog.js', obj.tag || 'errorMessage', {
        type: 'errorMessage',
        obj,
      },);
    };

    this.successMessage = (obj: MessageOptions): void => {
      this.glitter.openDiaLog('glitterBundle/dialog/dialog.js', 'successMessage', {
        type: 'successMessage',
        obj,
      },);
    };

    this.warningMessage = (obj: ConfirmDialogOptions): void => {
      this.openConfirmDialog('warningMessage', obj);
    };

    this.checkYesOrNot = (obj: ConfirmDialogOptions): void => {
      this.openConfirmDialog('checkYesOrNot', obj);
    };
    this.confirmMessage = (obj: ConfirmDialogOptions): void => {
      this.openConfirmDialog('confirmMessage', obj);
    };

    this.customCheck = (obj: ConfirmDialogOptions): void => {
      this.openConfirmDialog('input_text', obj);
    };

    this.checkYesOrNotWithCustomWidth = (obj: ConfirmDialogOptions): void => {
      this.openConfirmDialog('checkYesOrNotWithCustomWidth', obj);
    };
  }

  private openConfirmDialog(type: string, obj: ConfirmDialogOptions): void {
    this.glitter.openDiaLog('glitterBundle/dialog/dialog.js', type, {
      type,
      title: obj.text,
      icon: obj.icon,
      yesString: obj.yesString,
      notString: obj.notString,
      callback: (response: boolean) => {
        this.glitter.closeDiaLog(type);
        obj.callback(response);
      },
    });
  }
}
