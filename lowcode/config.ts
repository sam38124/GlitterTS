export const config = {
    url: (window as any).glitterBackend ?? location.origin,
    token: '',
    appName: (window as any).appName,
};
