export const languages = {
  en: 'English',
  'zh-cn': '简体中文',
};

export const defaultLang = 'zh-cn';

export const ui = {
  en: {
    'cafeNotSupported': {
      text: 'This feature is not supported by the FFCafe version of XIVAPI. See ',
      linkText: 'here',
      suffix: ' for details. Please use the official version if you need this feature.',
    },
  },
  'zh-cn': {
    'cafeNotSupported': {
      text: '此处描述的是原版 XIVAPI 的功能，由 FFCafe 提供的 XIVAPI 服务不支持此功能。详情请参考',
      linkText: '此页面',
      suffix: '。如果您需要此功能，请使用国际服版本。',
    },
  },
} as const;
