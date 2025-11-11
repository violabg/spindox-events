export type PageWithParams<T extends object> = {
  params: Promise<T>;
};

export type PageWithParamsAndSearchParams<T extends object, S extends object> = {
  params: Promise<T>;
  searchParams: Promise<S>;
};
