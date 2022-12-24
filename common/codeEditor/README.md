# @juggle-data-view/code-editor
Dynamic import components and package in runtime. Support cjs.

## Install
``` shell
pnpm add @juggle-data-view/code-editor
```

## Usage

```typescript
  import CodeEditor from '@juggle-data-view/code-editor';

  const CodeEditorWrap (props) => {
    const [val,setVal] = useState();
    const handleSubmit = (val) => {
      console.log(val)
    }

    return (
      <CodeEditor
        value={value}
        options={{
          mode: 'javascript',
          lint: false, 
        }}
        onSubmit={handleSubmit}
        height={120}
      />
    );
  }

```

## dev 
``` shell
pnpm link --global # in dynamicimport directory
pnpm link @juggle-data-view/code-editor --global # in use directory
```