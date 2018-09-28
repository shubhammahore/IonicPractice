import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the LimitPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'limit',
})
export class LimitPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, args) {
    let limit = args ? parseInt(args, 30) : 30;
    let trail = '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
   
  }
}
