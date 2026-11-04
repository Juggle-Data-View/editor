import { CSSProperties } from 'react';

const box: CSSProperties = {
  boxSizing: 'border-box',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: 12,
  color: '#ffb020',
  background: 'rgba(8, 16, 32, 0.72)',
  border: '1px dashed #ffb020',
  fontSize: 14,
  lineHeight: 1.4,
};

/** Shown when a remote bundle cannot be fetched or evaluated. */
export default function RemotePlaceholder({ message, kind }: { message?: string; kind: 'load' | 'render' }) {
  return (
    <div data-remote-placeholder={kind} style={box}>
      {message || (kind === 'load' ? '组件加载失败' : '组件运行异常')}
    </div>
  );
}
