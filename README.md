# Juggle Data View
Easy to display your Data. ([preview](https://dataview.ashesborn.cloud/));

## Portfolio demo (no login, static)

The demo build does not call Parse or `lowcode-backend`. Pages stay in the browser (IndexedDB). A few charts and the `componetsStore` text sample are loaded at runtime from `/components/<name>/<version>/` and evaluated in a `new Function` sandbox. Install with pnpm 7 (the lockfile is v5.4), on Node 22:

```shell
corepack prepare pnpm@7.33.6 --activate
pnpm install
npm run build:demo
npx wrangler deploy
```

`npm run build:demo` writes the editor to `build/` and the remote bundles to `public/components/` (copied into `build/components`). `wrangler.jsonc` serves that directory as Worker static assets (`juggle-editor-demo`) with SPA fallback. No Worker script is deployed.

Component sources under `components/` are vendored so this repo builds alone. They should move back to [Juggle-Data-View/componetsStore](https://github.com/Juggle-Data-View/componetsStore) and be produced by [Juggle-Data-View/cli](https://github.com/Juggle-Data-View/cli) later. The built-in ECharts set (multi-series, radar, funnel, treemap, and the rest), `commonTitle`, `group`, `codeFragment`, and `datasource` stay in the editor bundle.

- [Deploy front end in local](#Deploy-front-end-in-local)
- [Deploy server side in local](#Deploy-server-side-in-local)
- [Directory struct ](#Directory-struct )

## Deploy front end in local

Use of basic functions
```shell
pnpm install
pnpm start
```

When want to change type define

``` shell
pnpm uninstall @juggle-data-view/types
git clone https://github.com/Juggle-Data-View/types.git
cd types
pnpm link --global
cd /path/to/editor #editor project dir
pnpm link --global @juggle-data-view/types
pnpm i
```

## Deploy server side in local
Start [parse-server](https://github.com/parse-community/parse-server) server in docker.(ref:https://github.com/parse-community/parse-server#using-docker);

Create `.env` file in editor folder
```shell
REACT_APP_PARSE_ID = APPLICATION_ID #as parse --appId
REACT_APP_PARSE_KEY = MASTER_KEY #as parse --masterKey 
REACT_APP_PARSE_SERVER_URL = https://api.ashesborn.cloud/parse #as parse --publicServerURL
REACT_APP_PARSE_MASTER_KET = MASTER_KEY #as parse --masterKey 
```

## Directory struct 
```
.
├── config # webpack config
│   ├── jest
│   └── webpack
│       └── persistentCache
├── doc # dev log
│   ├── 202201
│   └── 202202
├── public
├── scripts
├── scripts_coustom
└── src
    ├── assets
    │   ├── fonts
    │   ├── lib
    │   │   ├── redux-undo
    │   │   └── ruler
    │   │       └── CanvasRuler
    │   └── style
    │       └── datePicker
    ├── components
    │   ├── base
    │   ├── common
    │   ├── comps # components store
    │   │   ├── codeFragment
    │   │   ├── commonTitle
    │   │   ├── datasource
    │   │   ├── echarts
    │   │   │   ├── configs
    │   │   │   │   ├── common
    │   │   │   │   │   └── icons
    │   │   │   │   └── templates
    │   │   │   ├── helper
    │   │   │   │   └── seriesHandles
    │   │   │   └── temps
    │   │   ├── group
    │   │   └── _template_
    │   ├── form # Config form components
    │   └── recursion # Config form generator
    │       ├── echarts
    │       └── widget
    ├── configurableComponents
    │   ├── form
    │   └── theme
    │       └── overrides
    ├── helpers
    ├── page # Page struct
    │   ├── canvas
    │   └── editor
    │       ├── Header
    │       ├── LeftPanel
    │       │   └── DataCreator
    │       ├── RightPanel
    │       │   └── DataPanel
    │       └── User
    │           └── Profile
    ├── service # API
    ├── store # State management
    │   ├── DB
    │   ├── features
    │   │   └── appSlice
    │   └── reducers
    ├── __test__
    │   ├── components
    │   │   └── recursion
    │   │       └── MockData
    │   └── utils
    │       └── MockData
    ├── @types
    └── utils
```
