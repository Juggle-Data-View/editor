import React, { useRef, useState, useEffect, useMemo } from 'react';
import { UnControlled, IUnControlledCodeMirror } from 'react-codemirror2';
import { Button, Dialog, DialogTitle, IconButton, Tooltip } from '@mui/material';
import styled from 'styled-components';
import jsonlint from 'jsonlint-mod';
import { useInViewport, useHover } from 'ahooks';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CodeIcon from '@mui/icons-material/Code';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

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

const DialogContainer = styled.div`
  .MuiDialog-container {
    width: 100%;
  }
`;

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
  }
`;

const CodeMirror = UnControlled as unknown as React.FC<IUnControlledCodeMirror>;

export type ModeName = 'htmlmixed' | 'css' | 'javascript' | 'application/json';

interface EditorProps extends IUnControlledCodeMirror {
  value: string;
  onSubmit?: (value: string) => void;
  height?: number;
}

const Editor = React.forwardRef((props: EditorProps, ref: any) => {
  const { onSubmit, height, ...codemirrorProps } = props;
  const { value, options } = codemirrorProps;
  const readOnly = options && options.readOnly;
  const divRef = useRef(null);

  const formatValue = useMemo(() => {
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }

    if (typeof value === 'function') {
      return (value as any).toString();
    }

    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }

    if (typeof value === 'boolean') {
      return (value as boolean).valueOf() + '';
    }
    return value;
  }, [value]);

  const formatProps = {
    options,
    value: formatValue,
  };

  const inViewPort = useInViewport(divRef);

  if (inViewPort) {
    ref.current.refresh();
  }

  useEffect(() => {
    const handleBlur = (editor: any) => {
      try {
        if (readOnly) return;
        const newValue = editor.getValue();

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
        if (error instanceof Error) console.log(`CodeError：${error.message}`);
      }
    };

    // https://github.com/scniro/react-codemirror2/issues/138
    ref.current.on('blur', handleBlur);
    return () => {
      ref.current.off('blur', handleBlur);
    };
  }, [onSubmit, options, readOnly, ref, formatValue]);

  return (
    <div className="wrapper" ref={divRef} style={{ height: height || '100%', width: '100%' }}>
      <CodeMirror
        {...formatProps}
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
    theme: 'default',
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <DialogContainer>
      <EditorStyled ref={ref}>
        <Editor ref={editorRef} {...ce_props} />
        {isHovering && zoomIn && (
          <div className="actions">
            <Button size="small" onClick={() => setOpen(true)}>
              <Tooltip title="放大">
                <ZoomInIcon />
              </Tooltip>
            </Button>
          </div>
        )}
      </EditorStyled>
      <Dialog open={open} fullScreen={fullScreen} onClose={() => setOpen(false)}>
        <DialogTitle style={{ padding: '5px 10px' }} id="responsive-dialog-title">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            代码编辑区
            <IconButton edge="start" color="inherit" onClick={() => setOpen(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        <EditorStyled style={{ width: '600px', paddingBottom: 0 }}>
          <Editor ref={editorRef} {...ce_props} height={document.documentElement.offsetHeight * 0.7} />
          <div className="actions">
            <Button size="small" onClick={handleFormat}>
              <Tooltip title="格式化">
                <CodeIcon />
              </Tooltip>
            </Button>
          </div>
        </EditorStyled>
      </Dialog>
    </DialogContainer>
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
