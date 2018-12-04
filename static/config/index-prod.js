/**
 * 生产环境
 */
;(function () {
  window.SITE_CONFIG = {};

  // api接口请求地址
  //window.SITE_CONFIG['baseUrl'] = 'http://192.168.84.163:9080/business-leasing-admin';
  window.SITE_CONFIG['baseUrl'] = 'http://58.210.9.131/business-leasing-admin';
  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain']  = './'; // 域名
  window.SITE_CONFIG['version'] = '';   // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl']  = window.SITE_CONFIG.domain + window.SITE_CONFIG.version;
})();
