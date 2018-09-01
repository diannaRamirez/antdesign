export const categories = {
  direction: [
    'step-backward', 'step-forward', 'fast-backward',
    'fast-forward', 'shrink', 'arrows-alt', 'down', 'up', 'left',
    'right', 'caret-up', 'caret-down', 'caret-left', 'caret-right',
    'up-circle', 'down-circle', 'left-circle', 'right-circle',
    'double-right', 'double-left', 'verticle-left', 'verticle-right',
    'forward', 'backward', 'rollback', 'enter', 'retweet',
    'swap', 'swap-left', 'swap-right', 'arrow-up', 'arrow-down',
    'arrow-left', 'arrow-right', 'play-circle',
    'up-square', 'down-square', 'left-square', 'right-square',
    'login', 'logout', 'menu-fold', 'menu-unfold',
  ],
  suggestion: [
    'question', 'question-circle',
    'plus', 'plus-circle', 'pause',
    'pause-circle', 'minus',
    'minus-circle', 'plus-square', 'minus-square',
    'info', 'info-circle',
    'exclamation', 'exclamation-circle',
    'close', 'close-circle', 'close-square',
    'check', 'check-circle',
    'check-square',
    'clock-circle', 'warning',
  ],
  other: [
    'lock', 'unlock', 'area-chart', 'pie-chart', 'bar-chart',
    'dot-chart', 'bars', 'book', 'calendar', 'cloud', 'cloud-download',
    'code', 'copy', 'credit-card', 'delete', 'desktop',
    'download', 'edit', 'ellipsis', 'file', 'file-text',
    'file-unknown', 'file-pdf', 'file-word', 'file-excel',
    'file-jpg', 'file-ppt', 'file-markdown', 'file-add',
    'folder', 'folder-open', 'folder-add', 'hdd', 'frown',
    'meh', 'smile', 'inbox',
    'laptop', 'appstore', 'line-chart', 'link',
    'mail', 'mobile', 'notification', 'paper-clip', 'picture',
    'poweroff', 'reload', 'search', 'setting', 'share-alt',
    'shopping-cart', 'tablet', 'tag', 'tags',
    'to-top', 'upload', 'user', 'video-camera',
    'home', 'loading', 'loading-3-quarters',
    'cloud-upload',
    'star', 'heart', 'environment',
    'eye', 'camera', 'save', 'team',
    'solution', 'phone', 'filter', 'exception', 'export',
    'customer-service', 'qrcode', 'scan', 'like',
    'dislike', 'message', 'pay-circle',
    'calculator', 'pushpin',
    'bulb', 'select', 'switcher', 'rocket', 'bell', 'disconnect',
    'database', 'compass', 'barcode', 'hourglass', 'key',
    'flag', 'layout', 'printer', 'sound', 'usb', 'skin', 'tool',
    'sync', 'wifi', 'car', 'schedule', 'user-add', 'user-delete',
    'usergroup-add', 'usergroup-delete', 'man', 'woman', 'shop',
    'gift', 'idcard', 'medicine-box', 'red-envelope', 'coffee',
    'copyright', 'trademark', 'safety', 'wallet', 'bank', 'trophy',
    'contacts', 'global', 'shake', 'api', 'fork', 'dashboard', 'form',
    'table', 'profile',
  ],
  logo: [
    'android', 'apple', 'windows',
    'ie', 'chrome', 'github', 'aliwangwang',
    'dingding',
    'weibo-square', 'weibo-circle', 'taobao-circle', 'html5',
    'weibo', 'twitter', 'wechat', 'youtube', 'alipay-circle',
    'taobao', 'skype', 'qq', 'medium-workmark', 'gitlab', 'medium',
    'linkedin', 'google-plus', 'dropbox', 'facebook', 'codepen',
    'amazon', 'google', 'codepen-circle', 'alipay', 'ant-design',
    'aliyun', 'zhihu', 'slack', 'slack-square', 'behance',
    'behance-square', 'dribbble', 'dribbble-square',
    'instagram', 'yuque',
  ],
};

export interface Categories {
  direction: string[];
  suggestion: string[];
  other: string[];
  logo: string[];
}

export type CategoriesKeys = keyof Categories;
