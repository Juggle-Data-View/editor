import React, { useRef, useState, useEffect } from 'react';
import { UnControlled as CodeMirror, IUnControlledCodeMirror } from 'react-codemirror2';
import { Button, Callout, Dialog, Tooltip } from '@blueprintjs/core';
import styled from 'styled-components';
import jsonlint from 'jsonlint-mod';
import { useInViewport, useHover } from 'ahooks';

(window as any).CodeMirror = require('codemirror');

require('codemirror/lib/codemirror.css');
require('codemirror/theme/material.css');

require('codemirror/mode/javascript/javascript.js');
require('codemirror/mode/htmlmixed/htmlmixed.js');
require('codemirror/mode/css/css.js');

require('codemirror/addon/lint/lint');
require('codemirror/addon/lint/javascript-lint');
require('codemirror/addon/lint/json-lint');
require('codemirror/addon/lint/css-lint');
require('codemirror/addon/lint/lint.css');

require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/foldgutter');
require('codemirror/addon/fold/brace-fold');
require('codemirror/addon/fold/indent-fold');
require('codemirror/addon/fold/foldgutter.css');

require('utils/codemirror-formatting');

(window as any).jsonlint = jsonlint;

const EditorStyled = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  .actions {
    position: absolute;
    top: 5px;
    right: 12px;
    z-index: 10;
  }
  .wrapper {
    position: relative;
    .errorMessage {
      position: absolute;
      top: 5px;
      left: 5px;
      right: 5px;
      padding: 10px 10px 10px 30px;
      width: auto;
      color: #fff;
      max-height: 50%;
      overflow: auto;
      background-color: ${(props) => props.theme.danger || 'red'};
      opacity: 0.9;
      z-index: 11;
      .btn-close {
        position: absolute;
        left: 5px;
        top: 7px;
      }
    }
  }
  .react-codemirror2 {
    height: 100%;
  }
  .CodeMirror {
    width: 100%;
    height: 100%;
    padding: 5px;
    background-color: rgba(16, 22, 26, 0.3) !important;
  }
`;

export type ModeName = 'htmlmixed' | 'css' | 'javascript' | 'application/json';

interface EditorProps extends IUnControlledCodeMirror {
  /** 需要修改的代码 */
  value: string;
  /** 失焦时触发的事件，值为变更后的新代码 */
  onSubmit?: (value: string) => void;
  /** 编辑器高度，不传时为 100% */
  height?: number;
}

const Editor = React.forwardRef((props: EditorProps, ref: any) => {
  const { onSubmit, height, ...codemirrorProps } = props;
  const { value, options } = codemirrorProps;
  const readOnly = options && options.readOnly;
  const divRef = useRef(null);
  const [error, setError] = useState('');

  const inViewPort = useInViewport(divRef);

  if (inViewPort) {
    ref.current.refresh();
  }

  useEffect(() => {
    const handleBlur = (editor: any) => {
      try {
        setError('');
        if (readOnly) return;
        const newValue = editor.getValue();

        // 这里先用`new Function`校验JS，后期换成JSHint
        if (options.mode === 'javascript') {
          try {
            new Function(`return ${newValue}`); //eslint-disable-line
          } catch (error) {
            throw error;
          }
        }

        const hasError = () => {
          if (!options.lint) return false;
          return editor.state.lint.marked.length;
        };

        if (!hasError()) {
          onSubmit && onSubmit(newValue);
        }
      } catch (error) {
        if (error instanceof Error) setError(`CodeError：${error.message}`);
      }
    };

    // 不在组件上使用onBlur的原因：
    // https://github.com/scniro/react-codemirror2/issues/138
    ref.current.on('blur', handleBlur);
    return () => {
      ref.current.off('blur', handleBlur);
    };
  }, [onSubmit, options, readOnly, ref, value]);

  return (
    <div className="wrapper" ref={divRef} style={{ height: height || '100%' }}>
      {error && (
        <Callout className="errorMessage">
          <Button className="btn-close" icon="cross" small minimal onClick={() => setError('')} />
          {error}
        </Callout>
      )}
      <CodeMirror
        {...codemirrorProps}
        editorDidMount={(editor) => {
          ref.current = editor;
          editor.refresh();
        }}
      />
    </div>
  );
});

interface CodeEditorProps extends EditorProps {
  zoomIn?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = (props) => {
  const { zoomIn = true, ...rest } = props; // rest排除掉zoomIn
  const [open, setOpen] = useState(false);
  const editorRef = useRef<any>(null);
  const ref = useRef<any>(null);
  const isHovering = useHover(ref);

  const defaultOptions = {
    mode: 'javascript' as ModeName,
    theme: 'material',
    tabSize: 2,
    lineNumbers: true,
    lineWrapping: true,
    line: true,
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
  };

  const ce_props: CodeEditorProps = {
    ...rest,
    options: {
      ...defaultOptions,
      ...rest.options,
    },
  };

  const { lint, readOnly } = ce_props.options;

  if (lint && !readOnly) {
    ce_props.options.gutters.unshift('CodeMirror-lint-markers');
  }

  const handleFormat = () => {
    const editor = editorRef.current;
    if (editor) {
      const totalLines = editor.lineCount();
      editor.autoFormatRange({ line: 0, ch: 0 }, { line: totalLines });
    }
  };

  return (
    <>
      <EditorStyled ref={ref}>
        <Editor ref={editorRef} {...ce_props} />
        {isHovering && zoomIn && (
          <div className="actions">
            <Tooltip content="放大" position="auto">
              <Button minimal icon="zoom-in" onClick={() => setOpen(true)} />
            </Tooltip>
          </div>
        )}
      </EditorStyled>
      <Dialog
        isOpen={open}
        onClose={() => setOpen(false)}
        style={{ width: document.documentElement.offsetWidth * 0.8, paddingBottom: 0 }}
        title="代码编辑区"
      >
        <EditorStyled>
          <Editor ref={editorRef} {...ce_props} height={document.documentElement.offsetHeight * 0.7} />
          <div className="actions">
            <Tooltip content="格式化" position="auto">
              <Button minimal icon="code" onClick={handleFormat} />
            </Tooltip>
          </div>
        </EditorStyled>
      </Dialog>
    </>
  );
};

export default CodeEditor;

export const JSONEditor: React.FC<CodeEditorProps> = (props) => {
  return (
    <CodeEditor
      {...props}
      options={{
        mode: { name: 'application/json' },
        lint: true,
        ...props.options,
      }}
    />
  );
};
