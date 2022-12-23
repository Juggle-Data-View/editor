# @juggle-data-view/dynamicimport
Dynamic import components and package in runtime. Support cjs.

## Install
``` shell
pnpm add @juggle-data-view/dynamicimport
```

## Usage

```typescript
  import dynamciImport from '@juggle-data-view/dynamicimport';

  // as component
  const module = await dynamicImport('http://component.server/comp_name',{
    react: react,
    'react-dom': reactdom,
    useConsumerHook: useConsumerHook,
  });
  const DynamicComp = module.default;
  React.createRoot(DynamicComp, document.createElement('div'));


  // as normal module 
  const module = await dynamicImport('http://module.server/module_name',{
    useConsumerHook: useConsumerHook,
  });
```

## dev 
``` shell
pnpm link --global # in dynamicimport directory
pnpm link @juggle-data-view/dynamicimport --global # in use directory
```