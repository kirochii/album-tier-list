
export default {
  basePath: 'https://kirochii.github.io/album-tier-list',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
