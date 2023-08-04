export default function escapeStringRegexp(string: string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a string");
  }
  return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

export const escapeRegex = (text: string) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

export const slug = (text: string) => {
  if (!text) return;
  let slug = text.toLowerCase();
  slug = slug.replace(/[^\w\s-]/g, "");
  slug = slug.replace(/\s+/g, "-");
  slug = slug.replace(/--+/g, "-");
  slug = slug.replace(/^-+|-+$/g, "");
  return slug;
};

export const filterValues = (query: any, partialSearchArr: string[]) => {
  const queryObj = { ...query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  for (let query in queryObj) {
    if (partialSearchArr.includes(query)) {
      queryObj[query] = {
        $regex: escapeStringRegexp(queryObj[query]),
        $options: "i",
      };
    }

    if (query.includes("$")) {
      const newProperty = query.replace("$", ".");
      const oldValue = queryObj[query];
      delete queryObj[query];
      queryObj[newProperty] = oldValue;
    }
  }

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  return JSON.parse(queryStr);
};
