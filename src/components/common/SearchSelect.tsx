import React, { useRef, SyntheticEvent } from 'react';
import { Menu, MenuItem, Button, Classes } from '@blueprintjs/core';
import { Select, ItemPredicate } from '@blueprintjs/select';

export type Item = {
  label: string;
  value: string | number | null;
};

export interface SearchSelectProps {
  activeItem: Item | undefined;
  items: Item[];
  onItemSelect: (item: Item, event?: SyntheticEvent<HTMLElement>) => void;
  extraRefresh?: React.ReactNode; // 是否显示刷新按钮
  showEmpty?: boolean; // 是否显示“无”选项
  placeholder?: string;
}

const filterItem: ItemPredicate<Item> = (query, item, _index, exactMatch) => {
  const normalizedTitle = item.label.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return item.label.indexOf(normalizedQuery) >= 0;
  }
};

const empty: Item = {
  label: '无',
  value: null,
};

const SearchSelect: React.FC<SearchSelectProps> = (props) => {
  const { activeItem, items, onItemSelect, extraRefresh, showEmpty = true, placeholder } = props;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLButtonElement>(null);

  return (
    <Select
      items={showEmpty ? [empty].concat(items) : items}
      filterable
      activeItem={activeItem}
      itemRenderer={(item, { handleClick, modifiers, query }) => {
        return (
          <MenuItem
            key={item.label}
            active={modifiers.active}
            disabled={modifiers.disabled}
            onClick={handleClick}
            text={highlightText(item.label, query)}
            title={item.label}
          />
        );
      }}
      itemListRenderer={({ items, itemsParentRef, query, renderItem }) => {
        const renderedItems = items.filter((item) => item.label.indexOf(query) > -1).map(renderItem);
        const total = Math.max(items.length - 1, 0); // 减去“无”的那一条

        return (
          <Menu ulRef={itemsParentRef} style={{ maxHeight: 310 }}>
            <MenuItem
              disabled={true}
              text={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={Classes.TEXT_OVERFLOW_ELLIPSIS} style={{ flex: 1 }}>
                    {query ? `找到${renderedItems.length}条 "${query}"` : `共${total}条`}
                  </div>
                  {extraRefresh ? extraRefresh : null}
                </div>
              }
            />
            {renderedItems}
          </Menu>
        );
      }}
      noResults={<MenuItem disabled={true} text="No results." />}
      onItemSelect={onItemSelect}
      popoverProps={{
        minimal: true,
        boundary: 'viewport',
        position: 'bottom-right',
        fill: true,
        popoverRef: popoverRef,
        onOpening(node) {
          node.style.width = buttonRef.current?.offsetWidth + 'px';
          (node.children[0] as HTMLDivElement).style.width = '100%';
        },
      }}
      itemPredicate={filterItem}
    >
      <Button
        title={activeItem ? `${activeItem.label}(${activeItem.value})` : ''}
        text={activeItem?.value ? activeItem.label : placeholder || '请选择下拉项'}
        rightIcon="double-caret-vertical"
        fill={true}
        alignText="left"
        elementRef={buttonRef}
      />
    </Select>
  );
};

export default SearchSelect;

function highlightText(text: string, query: string) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens: React.ReactNode[] = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

function escapeRegExpChars(text: string) {
  // eslint-disable-next-line
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
