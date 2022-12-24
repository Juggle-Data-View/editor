# @juggle-data-view/notice
Dynamic import components and package in runtime. Support cjs.

## Install
``` shell
pnpm add @juggle-data-view/notice
```

## Usage

```typescript
  import notice from '@juggle-data-view/notice';

  notice.alert('message',{
    canEnterKeyConfirm: true
    canEscapeKeyCancel: false
    intent: "infor";
    cancelButtonText: "cancel";
    confirmButtonText: "confirm";
  })

  notice.error('message')

  notice.warn('message')

  notice.success('message')

```

## dev 
``` shell
pnpm link --global # in dynamicimport directory
pnpm link @juggle-data-view/notice --global # in use directory
```