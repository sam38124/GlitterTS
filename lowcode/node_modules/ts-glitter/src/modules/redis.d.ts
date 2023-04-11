declare const _default: {
    connect: () => Promise<unknown>;
    getHashmap: (key: string) => Promise<unknown>;
    setHashmap: (key: string, obj: any) => Promise<unknown>;
    getValue: (key: string) => Promise<unknown>;
    setValue: (key: string, value: string) => Promise<unknown>;
    setValueWithExp: (key: string, value: string, ttl: number) => Promise<unknown>;
    expire: (key: string, seconds: number) => Promise<unknown>;
    increase: (key: string) => Promise<unknown>;
    exists: (key: string) => Promise<unknown>;
    hexists: (key: string, field: string) => Promise<unknown>;
    scan: (key: string) => Promise<unknown>;
    hkeys: (key: string) => Promise<unknown>;
    hget: (key: string, field: string) => Promise<unknown>;
    hdel: (key: string, fields: any[]) => Promise<unknown>;
    deleteKey: (key: string) => Promise<unknown>;
};
export default _default;
