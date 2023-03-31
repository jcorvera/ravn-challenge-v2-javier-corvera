export const pagination = (total: number, page: number, pageSize: number) => {
  const lastPage = Math.ceil(total / pageSize);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < lastPage ? page + 1 : null;

  return { total, lastPage, page, prevPage, nextPage };
};
