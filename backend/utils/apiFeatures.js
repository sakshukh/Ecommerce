/** @format */

class ApiFeatures {
  constructor(query, queryStr) {
    (this.query = query), (this.queryStr = queryStr);
  }

  search = () => {
    let keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  };

  filter = () => {
    let queryCopy = { ...this.queryStr };

    let removeFields = ["keyword", "page", "limit"];

    // Remove fields from query string
    removeFields.forEach((item) => delete queryCopy[item]);

    let queryStringify = JSON.stringify(queryCopy);

    queryStringify = queryStringify.replace(
      /\b(gt | lt | gte | lte)\b/g,
      (key) => "$" + key
    );
    this.query = this.query.find(JSON.parse(queryStringify));
    return this;
  };

  pegination = (resultPerPage) => {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * currentPage - 1;

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  };
}

module.exports = ApiFeatures;
