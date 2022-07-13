const urlPattern = new RegExp(['^(http|https|)://|[a-zA-Z0-9-.]+.[a-zA-Z](:[a-zA-Z0-9]*)?',
  '/?([a-zA-Z0-9-._?,\'/\\+&amp;%$#=~])*[^.,)(s]$'].join(''), 'i');

module.exports = { urlPattern };
