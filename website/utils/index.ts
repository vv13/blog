export function escape2Html(str: string) {
    const arrEntities = { lt: '<', gt: '>', nbsp: ' ', amp: '&', quot: '"' }
    return str
        .replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t: keyof typeof arrEntities) {
            return arrEntities[t]
        })
        .trim()
}
