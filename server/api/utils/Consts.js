// Format the fetched images to include only 'url', 'secure_url', and 'public_id'
exports.formattedResult = (result) => {
  const cleanResult = result.map((el) => {
    return {
      ...el.toJSON(),
      pictures: el.pictures.map((image) => ({
        url: image.url,
        secure_url: image.secure_url,
        public_id: image.public_id,
      })),
    };
  });
  return cleanResult;
};
exports.formattedEventResults = (result) => {
  const cleanResult = result.map((el) => {
    return {
      ...el.toJSON(),
      event_date: el.event_date.toISOString().split("T")[0],
      pictures: el.pictures.map((image) => ({
        url: image.url,
        secure_url: image.secure_url,
        public_id: image.public_id,
      })),
    };
  });
  return cleanResult;
};
