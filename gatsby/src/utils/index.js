export function escape2Html(str) {
  const arrEntities = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' };
  return str
    .replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
      return arrEntities[t];
    })
    .trim();
}
