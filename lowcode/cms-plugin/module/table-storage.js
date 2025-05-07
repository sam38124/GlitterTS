export class TableStorage {
}
TableStorage.limitList = [10, 25, 50, 75, 100];
TableStorage.setLimit = (limit) => {
    localStorage.setItem('table_default_limit', `${limit}`);
};
TableStorage.getLimit = () => {
    var _a;
    const limit = parseInt((_a = localStorage.getItem('table_default_limit')) !== null && _a !== void 0 ? _a : '10', 10);
    return isNaN(limit) ? 10 : limit;
};
