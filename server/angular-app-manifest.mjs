
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://kirochii.github.io/album-tier-list/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/album-tier-list"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 6668, hash: '9de86a2c02bb34e60f9dfe9fdae60be21c65ad61d7efd85f55a9cbf89d8def0c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1048, hash: '02336f80cea4d58ce66a13eb2d225eaae07de68f5b9e858d9f7ee24babcb8108', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 107010, hash: 'ca22bc404822c4dd4acb46c55f70521f1096459c119a972f512c38a62db09fbf', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-47SPFT7O.css': {size: 29481, hash: 'kOkJrepyq6g', text: () => import('./assets-chunks/styles-47SPFT7O_css.mjs').then(m => m.default)}
  },
};
