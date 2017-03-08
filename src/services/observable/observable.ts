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

function CombineLatestZip<TIn, TOut>(
  array: TIn[],
  projection: Projection<TIn, TOut>,
): Observable<[ TIn, TOut ][]> {

  return CombineLatestAggregate(array, projection, (results) => _.zipWith<[ TIn, TOut ]>(array, results, (a, r) => [a, r]));
}

function CombineLatestZipPost<TIn, TOut>(
  array: TIn[],
  project: Projection<TIn, TOut>,
  post: Transform<[ TIn, TOut ][], [ TIn, TOut ][]>,
): Observable<TIn[]> {

  return CombineLatestZip(array, project)
    .map((arr) => post(arr))
    .map((arr) => _.map(arr, ([a, i]) => a));
}

export function CombineLatestFilter<TIn>(
  array: TIn[],
  predicate: Projection<TIn, boolean>,
): Observable<TIn[]> {

  return CombineLatestZipPost(array, predicate, (results) => _.filter(results, ([val, pred]) => pred));
}

export function CombineLatestOrderBy<TIn, TOut>(
  array: TIn[],
  orderBy: Projection<TIn, TOut>,
): Observable<TIn[]> {

  return CombineLatestZipPost(array, orderBy, (results) => _.sortBy(results, ([val, sort]) => sort));
}
