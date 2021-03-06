
import { Injectable, Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'propToArray'
})
@Injectable()
export class PropToArrayPipe implements PipeTransform {

    transform(value, args: string[]): any {
        const keys = [];
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                keys.push({ key: key, value: value[key] });
            }
        }
        return keys.sort(function (a, b) { return 0.5 - Math.random(); });
    }
}


