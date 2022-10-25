# Juggle Data View
Easy to display your Data. ([preview](https://dataview.ashesborn.cloud/));

- [Deploy front end in local](#Deploy-front-end-in-local)
- [Deyploy server side in local](#Deploy-server-side-in-local)
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

## Deyploy server side in local
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