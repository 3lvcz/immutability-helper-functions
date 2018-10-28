type KeyValuePair<K, V> = [K, V];
type OneOrMany<T> = T | T[];
type KeyOrPath = OneOrMany<string | number>;
type SpliceArgs = [number, number, ...any[]];

// #####
// $push
// #####

export function $push<T>(src: T[], valueOrMany: OneOrMany<T>): T[];

export function $push<T extends object, K>(
  src: T,
  dest: KeyOrPath,
  valueOrMany: OneOrMany<K>
): T;

// ########
// $unshift
// ########

export function $unshift<T>(src: T[], valueOrMany: OneOrMany<T>): T[];

export function $unshift<T extends object, K>(
  src: T,
  dest: KeyOrPath,
  valueOrMany: OneOrMany<K>
): T;

// #######
// $splice
// #######

export function $splice<T>(
  src: T[],
  spliceArgsOrMany: OneOrMany<SpliceArgs>
): T[];

export function $splice<T extends object>(
  src: T[],
  dest: KeyOrPath,
  spliceArgsOrMany: OneOrMany<SpliceArgs>
): T;

// ####
// $set
// ####

export function $set<T extends object>(src: T, dest: KeyOrPath, value: any): T;

// #######
// $toggle
// #######

export function $toggle<T extends object>(
  src: T,
  dest: KeyOrPath,
  keyOrMany?: OneOrMany<string>
): T;

// ######
// $unset
// ######

export function $unset<T extends object>(
  src: T,
  dest: KeyOrPath,
  keyOrMany?: OneOrMany<string>
): T;

// ######
// $merge
// ######

export function $merge<T extends object, K extends object>(
  src: T,
  obj: K
): T & K;

export function $merge<T extends object>(
  src: T,
  dest: KeyOrPath,
  obj: object
): T;

// ######
// $apply
// ######

export function $apply<T extends object, K>(src: T, fn: (src: T) => K): K;

export function $apply<T extends object>(
  src: T,
  dest: KeyOrPath,
  fn: (arg: any) => any
): T;

// ####
// $add
// ####

export function $add<T>(src: Set<T>, valueOrMany: OneOrMany<T>): Set<T>;

export function $add<T extends object>(
  src: T,
  dest: KeyOrPath,
  valueOrMany: OneOrMany<T>
): T;

export function $add<K, V>(
  src: Map<K, V>,
  keyValueArrayOrMany: OneOrMany<KeyValuePair<K, V>>
): Map<K, V>;

export function $add<T extends object, K, V>(
  src: T,
  dest: KeyOrPath,
  keyValueArrayOrMany: OneOrMany<KeyValuePair<K, V>>
): T;

// #######
// $remove
// #######

export function $remove<T>(src: Set<T>, valueOrMany: OneOrMany<T>): Set<T>;

export function $remove<T extends object>(
  src: T,
  dest: KeyOrPath,
  valueOrMany: OneOrMany<T>
): T;

export function $remove<K, V>(
  src: Map<K, V>,
  keyOrMany: OneOrMany<K>
): Map<K, V>;

export function $remove<T extends object, K>(
  src: T,
  dest: KeyOrPath,
  keyOrMany: OneOrMany<K>
): T;
