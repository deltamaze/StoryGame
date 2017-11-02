import { ValidatorFn, AbstractControl, FormControl } from '@angular/forms';


export class Utils {


  public static maxValue(max: Number): ValidatorFn {
    return (control: FormControl): { [key: string]: boolean } | null => {

      const val: number = control.value;

      if (control.pristine || control.pristine) {
        return null;
      }
      if (val <= max) {
        return null;
      }
      return { 'max': true };
    };
  }

  public static minValue(min: Number): ValidatorFn {
    return (control: FormControl): { [key: string]: boolean } | null => {

      const val: number = control.value;

      if (control.pristine || control.pristine) {
        return null;
      }
      if (val >= min) {
        return null;
      }
      return { 'min': true };
    };
  }

  static max(max: number): ValidatorFn {
    return (control: FormControl): { [key: string]: boolean } | null => {

      const val: number = control.value;

      if (control.pristine || control.pristine) {
        return null;
      }
      if (val <= max) {
        return null;
      }
      return { 'max': true };
    };
  }
}
