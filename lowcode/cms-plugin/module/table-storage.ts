export class TableStorage {
  static limitList = [10, 25, 50, 75, 100];

  static setLimit = (limit: number) => {
    localStorage.setItem('table_default_limit', `${limit}`);
  };

  static getLimit = () => {
    const limit = parseInt(localStorage.getItem('table_default_limit') ?? '10', 10);
    return isNaN(limit) ? 10 : limit;
  };
}
