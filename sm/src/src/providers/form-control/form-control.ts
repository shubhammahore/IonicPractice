import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormBase } from '../../models/form';

@Injectable()
export class FormControlProvider {

  constructor() {
  }

  toFormGroup(orderForm: FormBase<any>[] ) {
    let group: any = {};

    orderForm.forEach(terminalFormField => {
      group[terminalFormField.key] = terminalFormField.required ? new FormControl(terminalFormField.value || '', Validators.required)
                                              : new FormControl(terminalFormField.value || '');
    });
    return new FormGroup(group);
  }

}
