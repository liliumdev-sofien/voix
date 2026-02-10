
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model DatasetSnapshot
 * 
 */
export type DatasetSnapshot = $Result.DefaultSelection<Prisma.$DatasetSnapshotPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more DatasetSnapshots
 * const datasetSnapshots = await prisma.datasetSnapshot.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more DatasetSnapshots
   * const datasetSnapshots = await prisma.datasetSnapshot.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.datasetSnapshot`: Exposes CRUD operations for the **DatasetSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DatasetSnapshots
    * const datasetSnapshots = await prisma.datasetSnapshot.findMany()
    * ```
    */
  get datasetSnapshot(): Prisma.DatasetSnapshotDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.10.2
   * Query Engine version: 5a9203d0590c951969e85a7d07215503f4672eb9
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    DatasetSnapshot: 'DatasetSnapshot'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'datasetSnapshot'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      DatasetSnapshot: {
        payload: Prisma.$DatasetSnapshotPayload<ExtArgs>
        fields: Prisma.DatasetSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DatasetSnapshotFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DatasetSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DatasetSnapshotFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DatasetSnapshotPayload>
          }
          findFirst: {
            args: Prisma.DatasetSnapshotFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DatasetSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DatasetSnapshotFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DatasetSnapshotPayload>
          }
          findMany: {
            args: Prisma.DatasetSnapshotFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DatasetSnapshotPayload>[]
          }
          create: {
            args: Prisma.DatasetSnapshotCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DatasetSnapshotPayload>
          }
          createMany: {
            args: Prisma.DatasetSnapshotCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.DatasetSnapshotDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DatasetSnapshotPayload>
          }
          update: {
            args: Prisma.DatasetSnapshotUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DatasetSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.DatasetSnapshotDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.DatasetSnapshotUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.DatasetSnapshotUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$DatasetSnapshotPayload>
          }
          aggregate: {
            args: Prisma.DatasetSnapshotAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateDatasetSnapshot>
          }
          groupBy: {
            args: Prisma.DatasetSnapshotGroupByArgs<ExtArgs>,
            result: $Utils.Optional<DatasetSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.DatasetSnapshotCountArgs<ExtArgs>,
            result: $Utils.Optional<DatasetSnapshotCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model DatasetSnapshot
   */

  export type AggregateDatasetSnapshot = {
    _count: DatasetSnapshotCountAggregateOutputType | null
    _min: DatasetSnapshotMinAggregateOutputType | null
    _max: DatasetSnapshotMaxAggregateOutputType | null
  }

  export type DatasetSnapshotMinAggregateOutputType = {
    id: string | null
    status: string | null
  }

  export type DatasetSnapshotMaxAggregateOutputType = {
    id: string | null
    status: string | null
  }

  export type DatasetSnapshotCountAggregateOutputType = {
    id: number
    status: number
    _all: number
  }


  export type DatasetSnapshotMinAggregateInputType = {
    id?: true
    status?: true
  }

  export type DatasetSnapshotMaxAggregateInputType = {
    id?: true
    status?: true
  }

  export type DatasetSnapshotCountAggregateInputType = {
    id?: true
    status?: true
    _all?: true
  }

  export type DatasetSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DatasetSnapshot to aggregate.
     */
    where?: DatasetSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DatasetSnapshots to fetch.
     */
    orderBy?: DatasetSnapshotOrderByWithRelationInput | DatasetSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DatasetSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DatasetSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DatasetSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DatasetSnapshots
    **/
    _count?: true | DatasetSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DatasetSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DatasetSnapshotMaxAggregateInputType
  }

  export type GetDatasetSnapshotAggregateType<T extends DatasetSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateDatasetSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDatasetSnapshot[P]>
      : GetScalarType<T[P], AggregateDatasetSnapshot[P]>
  }




  export type DatasetSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DatasetSnapshotWhereInput
    orderBy?: DatasetSnapshotOrderByWithAggregationInput | DatasetSnapshotOrderByWithAggregationInput[]
    by: DatasetSnapshotScalarFieldEnum[] | DatasetSnapshotScalarFieldEnum
    having?: DatasetSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DatasetSnapshotCountAggregateInputType | true
    _min?: DatasetSnapshotMinAggregateInputType
    _max?: DatasetSnapshotMaxAggregateInputType
  }

  export type DatasetSnapshotGroupByOutputType = {
    id: string
    status: string
    _count: DatasetSnapshotCountAggregateOutputType | null
    _min: DatasetSnapshotMinAggregateOutputType | null
    _max: DatasetSnapshotMaxAggregateOutputType | null
  }

  type GetDatasetSnapshotGroupByPayload<T extends DatasetSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DatasetSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DatasetSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DatasetSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], DatasetSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type DatasetSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    status?: boolean
  }, ExtArgs["result"]["datasetSnapshot"]>

  export type DatasetSnapshotSelectScalar = {
    id?: boolean
    status?: boolean
  }


  export type $DatasetSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DatasetSnapshot"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      status: string
    }, ExtArgs["result"]["datasetSnapshot"]>
    composites: {}
  }


  type DatasetSnapshotGetPayload<S extends boolean | null | undefined | DatasetSnapshotDefaultArgs> = $Result.GetResult<Prisma.$DatasetSnapshotPayload, S>

  type DatasetSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DatasetSnapshotFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DatasetSnapshotCountAggregateInputType | true
    }

  export interface DatasetSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DatasetSnapshot'], meta: { name: 'DatasetSnapshot' } }
    /**
     * Find zero or one DatasetSnapshot that matches the filter.
     * @param {DatasetSnapshotFindUniqueArgs} args - Arguments to find a DatasetSnapshot
     * @example
     * // Get one DatasetSnapshot
     * const datasetSnapshot = await prisma.datasetSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DatasetSnapshotFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, DatasetSnapshotFindUniqueArgs<ExtArgs>>
    ): Prisma__DatasetSnapshotClient<$Result.GetResult<Prisma.$DatasetSnapshotPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one DatasetSnapshot that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {DatasetSnapshotFindUniqueOrThrowArgs} args - Arguments to find a DatasetSnapshot
     * @example
     * // Get one DatasetSnapshot
     * const datasetSnapshot = await prisma.datasetSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DatasetSnapshotFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DatasetSnapshotFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__DatasetSnapshotClient<$Result.GetResult<Prisma.$DatasetSnapshotPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first DatasetSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetSnapshotFindFirstArgs} args - Arguments to find a DatasetSnapshot
     * @example
     * // Get one DatasetSnapshot
     * const datasetSnapshot = await prisma.datasetSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DatasetSnapshotFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, DatasetSnapshotFindFirstArgs<ExtArgs>>
    ): Prisma__DatasetSnapshotClient<$Result.GetResult<Prisma.$DatasetSnapshotPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first DatasetSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetSnapshotFindFirstOrThrowArgs} args - Arguments to find a DatasetSnapshot
     * @example
     * // Get one DatasetSnapshot
     * const datasetSnapshot = await prisma.datasetSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DatasetSnapshotFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, DatasetSnapshotFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__DatasetSnapshotClient<$Result.GetResult<Prisma.$DatasetSnapshotPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more DatasetSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetSnapshotFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DatasetSnapshots
     * const datasetSnapshots = await prisma.datasetSnapshot.findMany()
     * 
     * // Get first 10 DatasetSnapshots
     * const datasetSnapshots = await prisma.datasetSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const datasetSnapshotWithIdOnly = await prisma.datasetSnapshot.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends DatasetSnapshotFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DatasetSnapshotFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DatasetSnapshotPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a DatasetSnapshot.
     * @param {DatasetSnapshotCreateArgs} args - Arguments to create a DatasetSnapshot.
     * @example
     * // Create one DatasetSnapshot
     * const DatasetSnapshot = await prisma.datasetSnapshot.create({
     *   data: {
     *     // ... data to create a DatasetSnapshot
     *   }
     * })
     * 
    **/
    create<T extends DatasetSnapshotCreateArgs<ExtArgs>>(
      args: SelectSubset<T, DatasetSnapshotCreateArgs<ExtArgs>>
    ): Prisma__DatasetSnapshotClient<$Result.GetResult<Prisma.$DatasetSnapshotPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many DatasetSnapshots.
     *     @param {DatasetSnapshotCreateManyArgs} args - Arguments to create many DatasetSnapshots.
     *     @example
     *     // Create many DatasetSnapshots
     *     const datasetSnapshot = await prisma.datasetSnapshot.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends DatasetSnapshotCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DatasetSnapshotCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a DatasetSnapshot.
     * @param {DatasetSnapshotDeleteArgs} args - Arguments to delete one DatasetSnapshot.
     * @example
     * // Delete one DatasetSnapshot
     * const DatasetSnapshot = await prisma.datasetSnapshot.delete({
     *   where: {
     *     // ... filter to delete one DatasetSnapshot
     *   }
     * })
     * 
    **/
    delete<T extends DatasetSnapshotDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, DatasetSnapshotDeleteArgs<ExtArgs>>
    ): Prisma__DatasetSnapshotClient<$Result.GetResult<Prisma.$DatasetSnapshotPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one DatasetSnapshot.
     * @param {DatasetSnapshotUpdateArgs} args - Arguments to update one DatasetSnapshot.
     * @example
     * // Update one DatasetSnapshot
     * const datasetSnapshot = await prisma.datasetSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DatasetSnapshotUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, DatasetSnapshotUpdateArgs<ExtArgs>>
    ): Prisma__DatasetSnapshotClient<$Result.GetResult<Prisma.$DatasetSnapshotPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more DatasetSnapshots.
     * @param {DatasetSnapshotDeleteManyArgs} args - Arguments to filter DatasetSnapshots to delete.
     * @example
     * // Delete a few DatasetSnapshots
     * const { count } = await prisma.datasetSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DatasetSnapshotDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, DatasetSnapshotDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DatasetSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DatasetSnapshots
     * const datasetSnapshot = await prisma.datasetSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DatasetSnapshotUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, DatasetSnapshotUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DatasetSnapshot.
     * @param {DatasetSnapshotUpsertArgs} args - Arguments to update or create a DatasetSnapshot.
     * @example
     * // Update or create a DatasetSnapshot
     * const datasetSnapshot = await prisma.datasetSnapshot.upsert({
     *   create: {
     *     // ... data to create a DatasetSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DatasetSnapshot we want to update
     *   }
     * })
    **/
    upsert<T extends DatasetSnapshotUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, DatasetSnapshotUpsertArgs<ExtArgs>>
    ): Prisma__DatasetSnapshotClient<$Result.GetResult<Prisma.$DatasetSnapshotPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of DatasetSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetSnapshotCountArgs} args - Arguments to filter DatasetSnapshots to count.
     * @example
     * // Count the number of DatasetSnapshots
     * const count = await prisma.datasetSnapshot.count({
     *   where: {
     *     // ... the filter for the DatasetSnapshots we want to count
     *   }
     * })
    **/
    count<T extends DatasetSnapshotCountArgs>(
      args?: Subset<T, DatasetSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DatasetSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DatasetSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DatasetSnapshotAggregateArgs>(args: Subset<T, DatasetSnapshotAggregateArgs>): Prisma.PrismaPromise<GetDatasetSnapshotAggregateType<T>>

    /**
     * Group by DatasetSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DatasetSnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DatasetSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DatasetSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: DatasetSnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DatasetSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDatasetSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DatasetSnapshot model
   */
  readonly fields: DatasetSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DatasetSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DatasetSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';


    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the DatasetSnapshot model
   */ 
  interface DatasetSnapshotFieldRefs {
    readonly id: FieldRef<"DatasetSnapshot", 'String'>
    readonly status: FieldRef<"DatasetSnapshot", 'String'>
  }
    

  // Custom InputTypes

  /**
   * DatasetSnapshot findUnique
   */
  export type DatasetSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatasetSnapshot
     */
    select?: DatasetSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which DatasetSnapshot to fetch.
     */
    where: DatasetSnapshotWhereUniqueInput
  }


  /**
   * DatasetSnapshot findUniqueOrThrow
   */
  export type DatasetSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatasetSnapshot
     */
    select?: DatasetSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which DatasetSnapshot to fetch.
     */
    where: DatasetSnapshotWhereUniqueInput
  }


  /**
   * DatasetSnapshot findFirst
   */
  export type DatasetSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatasetSnapshot
     */
    select?: DatasetSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which DatasetSnapshot to fetch.
     */
    where?: DatasetSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DatasetSnapshots to fetch.
     */
    orderBy?: DatasetSnapshotOrderByWithRelationInput | DatasetSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DatasetSnapshots.
     */
    cursor?: DatasetSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DatasetSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DatasetSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DatasetSnapshots.
     */
    distinct?: DatasetSnapshotScalarFieldEnum | DatasetSnapshotScalarFieldEnum[]
  }


  /**
   * DatasetSnapshot findFirstOrThrow
   */
  export type DatasetSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatasetSnapshot
     */
    select?: DatasetSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which DatasetSnapshot to fetch.
     */
    where?: DatasetSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DatasetSnapshots to fetch.
     */
    orderBy?: DatasetSnapshotOrderByWithRelationInput | DatasetSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DatasetSnapshots.
     */
    cursor?: DatasetSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DatasetSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DatasetSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DatasetSnapshots.
     */
    distinct?: DatasetSnapshotScalarFieldEnum | DatasetSnapshotScalarFieldEnum[]
  }


  /**
   * DatasetSnapshot findMany
   */
  export type DatasetSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatasetSnapshot
     */
    select?: DatasetSnapshotSelect<ExtArgs> | null
    /**
     * Filter, which DatasetSnapshots to fetch.
     */
    where?: DatasetSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DatasetSnapshots to fetch.
     */
    orderBy?: DatasetSnapshotOrderByWithRelationInput | DatasetSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DatasetSnapshots.
     */
    cursor?: DatasetSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DatasetSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DatasetSnapshots.
     */
    skip?: number
    distinct?: DatasetSnapshotScalarFieldEnum | DatasetSnapshotScalarFieldEnum[]
  }


  /**
   * DatasetSnapshot create
   */
  export type DatasetSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatasetSnapshot
     */
    select?: DatasetSnapshotSelect<ExtArgs> | null
    /**
     * The data needed to create a DatasetSnapshot.
     */
    data: XOR<DatasetSnapshotCreateInput, DatasetSnapshotUncheckedCreateInput>
  }


  /**
   * DatasetSnapshot createMany
   */
  export type DatasetSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DatasetSnapshots.
     */
    data: DatasetSnapshotCreateManyInput | DatasetSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }


  /**
   * DatasetSnapshot update
   */
  export type DatasetSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatasetSnapshot
     */
    select?: DatasetSnapshotSelect<ExtArgs> | null
    /**
     * The data needed to update a DatasetSnapshot.
     */
    data: XOR<DatasetSnapshotUpdateInput, DatasetSnapshotUncheckedUpdateInput>
    /**
     * Choose, which DatasetSnapshot to update.
     */
    where: DatasetSnapshotWhereUniqueInput
  }


  /**
   * DatasetSnapshot updateMany
   */
  export type DatasetSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DatasetSnapshots.
     */
    data: XOR<DatasetSnapshotUpdateManyMutationInput, DatasetSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which DatasetSnapshots to update
     */
    where?: DatasetSnapshotWhereInput
  }


  /**
   * DatasetSnapshot upsert
   */
  export type DatasetSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatasetSnapshot
     */
    select?: DatasetSnapshotSelect<ExtArgs> | null
    /**
     * The filter to search for the DatasetSnapshot to update in case it exists.
     */
    where: DatasetSnapshotWhereUniqueInput
    /**
     * In case the DatasetSnapshot found by the `where` argument doesn't exist, create a new DatasetSnapshot with this data.
     */
    create: XOR<DatasetSnapshotCreateInput, DatasetSnapshotUncheckedCreateInput>
    /**
     * In case the DatasetSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DatasetSnapshotUpdateInput, DatasetSnapshotUncheckedUpdateInput>
  }


  /**
   * DatasetSnapshot delete
   */
  export type DatasetSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatasetSnapshot
     */
    select?: DatasetSnapshotSelect<ExtArgs> | null
    /**
     * Filter which DatasetSnapshot to delete.
     */
    where: DatasetSnapshotWhereUniqueInput
  }


  /**
   * DatasetSnapshot deleteMany
   */
  export type DatasetSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DatasetSnapshots to delete
     */
    where?: DatasetSnapshotWhereInput
  }


  /**
   * DatasetSnapshot without action
   */
  export type DatasetSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DatasetSnapshot
     */
    select?: DatasetSnapshotSelect<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const DatasetSnapshotScalarFieldEnum: {
    id: 'id',
    status: 'status'
  };

  export type DatasetSnapshotScalarFieldEnum = (typeof DatasetSnapshotScalarFieldEnum)[keyof typeof DatasetSnapshotScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type DatasetSnapshotWhereInput = {
    AND?: DatasetSnapshotWhereInput | DatasetSnapshotWhereInput[]
    OR?: DatasetSnapshotWhereInput[]
    NOT?: DatasetSnapshotWhereInput | DatasetSnapshotWhereInput[]
    id?: StringFilter<"DatasetSnapshot"> | string
    status?: StringFilter<"DatasetSnapshot"> | string
  }

  export type DatasetSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type DatasetSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DatasetSnapshotWhereInput | DatasetSnapshotWhereInput[]
    OR?: DatasetSnapshotWhereInput[]
    NOT?: DatasetSnapshotWhereInput | DatasetSnapshotWhereInput[]
    status?: StringFilter<"DatasetSnapshot"> | string
  }, "id">

  export type DatasetSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    status?: SortOrder
    _count?: DatasetSnapshotCountOrderByAggregateInput
    _max?: DatasetSnapshotMaxOrderByAggregateInput
    _min?: DatasetSnapshotMinOrderByAggregateInput
  }

  export type DatasetSnapshotScalarWhereWithAggregatesInput = {
    AND?: DatasetSnapshotScalarWhereWithAggregatesInput | DatasetSnapshotScalarWhereWithAggregatesInput[]
    OR?: DatasetSnapshotScalarWhereWithAggregatesInput[]
    NOT?: DatasetSnapshotScalarWhereWithAggregatesInput | DatasetSnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DatasetSnapshot"> | string
    status?: StringWithAggregatesFilter<"DatasetSnapshot"> | string
  }

  export type DatasetSnapshotCreateInput = {
    id: string
    status: string
  }

  export type DatasetSnapshotUncheckedCreateInput = {
    id: string
    status: string
  }

  export type DatasetSnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type DatasetSnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type DatasetSnapshotCreateManyInput = {
    id: string
    status: string
  }

  export type DatasetSnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type DatasetSnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DatasetSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type DatasetSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type DatasetSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use DatasetSnapshotDefaultArgs instead
     */
    export type DatasetSnapshotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DatasetSnapshotDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}