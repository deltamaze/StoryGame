import { ValidatorFn, AbstractControl  } from '@angular/forms';


export class Utils {


public static maxValue(max: Number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const input = control.value,
          isValid = input > max;
    if(isValid) 
        return { 'maxValue': {max} }
    else 
        return null;
  };
}

public static minValue(min: Number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const input = control.value,
          isValid = input < min;
    if(isValid) 
        return { 'minValue': {min} }
    else 
        return null;
  };
}

}