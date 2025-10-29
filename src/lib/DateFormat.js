export const formatDate = (date) => {
  let formatted_date = `${date.getFullYear()}/${
    date.getMonth() + 1
  }/${date.getDate()}`;
  return formatted_date;
};
