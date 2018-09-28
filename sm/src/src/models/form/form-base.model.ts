export class FormBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  KT:string;
  isCheck:string;
  checked:boolean;
  format:string;
  formName:string;
 
  constructor(options: {
    value?: T,
    key?: string,
    label?: string,
    required?: boolean,
    order?: number,
    controlType?: string
  } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
  }
}


export class TextboxForm extends FormBase<string> {
  controlType = 'textbox';
  type: string;
  pattern:string;
  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}

export class DropdownForm extends FormBase<string> {
  controlType = 'dropdown';
  options: { DV: string, Data: string }[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.options = options['options'] || [];
  }
}


export class DateTimeForm extends FormBase<string> {
  controlType = 'datetime';

  constructor(options: {} = {}) {
    super(options);

  }
}
export class CheckBoxForm extends FormBase<string> {
  controlType = 'checkbox';

  constructor(options: {} = {}) {
    super(options);

  }
}



export class ToggleForm extends FormBase<string> {
  controlType = 'toggle';

  constructor(options: {} = {}) {
    super(options);

  }
}

export class FileForm extends FormBase<string> {
  controlType = 'file';

  constructor(options: {} = {}) {
    super(options);

  }
}