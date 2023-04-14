export type DatabaseInitialization = {
    isTest?: boolean
    url: string
}

export type OptionalQuery<T> = {
    [K in keyof T]?: T[K];
};