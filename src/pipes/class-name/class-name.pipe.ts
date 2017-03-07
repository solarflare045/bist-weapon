import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Api } from '../../services/api/api';

@Pipe({ name: 'appClassName' })
export class ClassNamePipe implements PipeTransform {
  constructor(private api: Api) { }
  transform(value: Observable<number>): Observable<string> {
    return this.api.classById(value).map((cls) => cls.name);
  }
}
