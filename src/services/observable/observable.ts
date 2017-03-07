import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

export type Projection<TIn, TOut> = (object: TIn) => Observable<TOut>;
export type Aggregate<TIn, TOut> = (array: TIn[]) => TOut;
export type Predicate<TIn> = (object: TIn) => boolean;
export type Transform<TIn, TOut> = (object: TIn) => TOut;

export function CombineLatest<TIn, TOut>(
  array: TIn[],
  project: Projection<TIn, TOut>,
): Observable<TOut[]> {

  return array.length
    ? Observable.combineLatest( _.map(array, project) )
    : Observable.of([]);
}

export function CombineLatestAggregate<TIn, TOut, TAggregate>(
  array: TIn[],
  project: Projection<TIn, TOut>,
  aggregate: Aggregate<TOut, TAggregate>,
): Observable<TAggregate> {

  return CombineLatest(array, project)
    .map((arr) => aggregate(arr));
}

export function CombineLatestEvery<TIn, TOut>(
  array: TIn[],
  project: Projection<TIn, TOut>,
  predicate: Predicate<TOut>,
): Observable<boolean> {

  return CombineLatestAggregate(array, project, (results) => _.every(results, predicate));
}

export function CombineLatestSum<TIn, TOut>(
  array: TIn[],
  project: Projection<TIn, TOut>,
  transform: Transform<TOut, number> = _.identity,
) {

  return CombineLatestAggregate(array, project, (results) => _.sumBy(results, transform));
}

export function CombineLatestCount<TIn, TOut>(
  array: TIn[],
  project: Projection<TIn, TOut>,
  predicate: Predicate<TOut>,
): Observable<number> {

  return CombineLatestSum(array, project, (val) => predicate(val) ? 1 : 0);
}

export function CombineLatestFilter<TIn>(
  array: TIn[],
  predicate: Projection<TIn, boolean>,
): Observable<TIn[]> {

  return CombineLatestAggregate(array, predicate, (results) => _.filter(array, (x, i) => results[i]));
}
