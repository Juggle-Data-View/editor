/**
 * 数据集下拉组件
 * Blueprint Select Component
 */
import * as React from 'react';
import { MenuItem, Button } from '@blueprintjs/core';
import { Select, ItemPredicate, ItemRenderer, IItemRendererProps } from '@blueprintjs/select';

/**
 * 数据集的数据列表
 */
interface IDataset {
  datasetId: number; // 数据集ID
  datasetName: string; // 数据集名称
}

// 数据集假数据
const DATASET_LIST: IDataset[] = [
  {
    datasetId: 1306,
    datasetName:
      '2019-综合屏-秒级-单曲线-测试用如果文字很长的话怎么办呢测试用如果文字很长的话怎么办呢测试用如果文字很长的话怎么办呢测试用如果文字很长的话怎么办呢测试用如果文字很长的话怎么办呢测试用如果文字很长的话怎么办呢',
  },
  { datasetId: 1287, datasetName: '最近7天下单金额模拟数据' },
  { datasetId: 1286, datasetName: '下单金额24小时分时对比' },
  {
    datasetId: 1284,
    datasetName: '体验功能中屏下单金额模拟数据',
  },
  { datasetId: 1053, datasetName: '服务器时间 - 翻牌器-公有' },
  { datasetId: 10531, datasetName: '服务器时间 - 翻牌器-公有1' },
  { datasetId: 10532, datasetName: '服务器时间 - 翻牌器-公有2' },
  { datasetId: 10533, datasetName: '服务器时间 - 翻牌器-公有3' },
  { datasetId: 10534, datasetName: '服务器时间 - 翻牌器-公有4' },
  { datasetId: 10535, datasetName: '服务器时间 - 翻牌器-公有5' },
  { datasetId: 10536, datasetName: '服务器时间 - 翻牌器-公有6' },
  { datasetId: 10537, datasetName: '服务器时间 - 翻牌器-公有7' },
  { datasetId: 10538, datasetName: '服务器时间 - 翻牌器-公有8' },
  { datasetId: 10539, datasetName: '服务器时间 - 翻牌器-公有9' },
  { datasetId: 105310, datasetName: '服务器时间 - 翻牌器-公有10' },
  { datasetId: 105311, datasetName: '服务器时间 - 翻牌器-公有11' },
  { datasetId: 105312, datasetName: '服务器时间 - 翻牌器-公有12' },
];

const renderFilm: ItemRenderer<IDataset> = (dataset, { handleClick, modifiers, query }: IItemRendererProps) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  const text = `${dataset.datasetName}`;
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={dataset.datasetId.toString()}
      key={dataset.datasetId}
      onClick={handleClick}
      title={dataset.datasetName}
      text={highlightText(text, query)}
    />
  );
};

const renderCreateFilmOption = (query: string, active: boolean, handleClick: React.MouseEventHandler<HTMLElement>) => (
  <MenuItem icon="add" text={`Create "${query}"`} active={active} onClick={handleClick} shouldDismissPopover={false} />
);

const filterFilm: ItemPredicate<IDataset> = (query, dataset, _index, exactMatch) => {
  const normalizedTitle = dataset.datasetName.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return dataset.datasetName.indexOf(normalizedQuery) >= 0;
  }
};

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

const filmSelectProps = {
  itemPredicate: filterFilm,
  itemRenderer: renderFilm,
  items: DATASET_LIST,
};

function createFilm(datasetName: string): IDataset {
  return {
    datasetId: 100 + Math.floor(Math.random() * 100 + 1),
    datasetName,
  };
}

function areFilmsEqual(datasetA: IDataset, datasetB: IDataset) {
  // Compare only the titles (ignoring case) just for simplicity.
  return datasetA.datasetName.toLowerCase() === datasetB.datasetName.toLowerCase();
}

function arrayContainsFilm(datasets: IDataset[], filmToFind: IDataset): boolean {
  return datasets.some((film: IDataset) => film.datasetName === filmToFind.datasetName);
}

function addFilmToArray(datasets: IDataset[], filmToAdd: IDataset) {
  return [...datasets, filmToAdd];
}

function deleteFilmFromArray(datasets: IDataset[], datasetToDelete: IDataset) {
  return datasets.filter((dataset) => dataset !== datasetToDelete);
}

function maybeAddCreatedFilmToArrays(
  items: IDataset[],
  createdItems: IDataset[],
  film: IDataset
): { createdItems: IDataset[]; items: IDataset[] } {
  const isNewlyCreatedItem = !arrayContainsFilm(items, film);
  return {
    createdItems: isNewlyCreatedItem ? addFilmToArray(createdItems, film) : createdItems,
    // Add a created film to `items` so that the film can be deselected.
    items: isNewlyCreatedItem ? addFilmToArray(items, film) : items,
  };
}

function maybeDeleteCreatedFilmFromArrays(
  items: IDataset[],
  createdItems: IDataset[],
  film: IDataset
): { createdItems: IDataset[]; items: IDataset[] } {
  const wasItemCreatedByUser = arrayContainsFilm(createdItems, film);

  // Delete the item if the user manually created it.
  return {
    createdItems: wasItemCreatedByUser ? deleteFilmFromArray(createdItems, film) : createdItems,
    items: wasItemCreatedByUser ? deleteFilmFromArray(items, film) : items,
  };
}

const FilmSelect = Select.ofType<IDataset>();

export interface ISelectExampleState {
  allowCreate: boolean; // 是否允许创建新数据，在未搜索到数据时
  createdItems: IDataset[]; // 被创建的条目
  dataset: IDataset; // Data list
  filterable: boolean; // Filterable
  hasInitialContent: boolean; // Use initial content
  items: IDataset[]; // {...{itemPredicate, itemRenderer, items}}
  minimal: boolean; // Minimal popover style
  resetOnClose: boolean; // Reset on close
  resetOnQuery: boolean; // Reset on query
  resetOnSelect: boolean; // Reset on select
  disableItems: boolean; // Disable films before 2000
  disabled: boolean; // Disabled
}

export default class DatasetSelect extends React.PureComponent<any, any> {
  public state: ISelectExampleState = {
    allowCreate: false,
    createdItems: [],
    disableItems: false,
    disabled: false,
    dataset: DATASET_LIST[0],
    filterable: true,
    hasInitialContent: false,
    items: filmSelectProps.items,
    minimal: false,
    resetOnClose: false,
    resetOnQuery: true,
    resetOnSelect: false,
  };

  render() {
    const { allowCreate, disabled, disableItems, dataset, hasInitialContent, minimal, items, ...flags } = this.state;

    const initialContent = hasInitialContent ? (
      <MenuItem disabled={true} text={`${items.length} items loaded.`} />
    ) : undefined;
    const maybeCreateNewItemFromQuery: any = allowCreate ? createFilm : undefined;
    const maybeCreateNewItemRenderer: any = allowCreate ? renderCreateFilmOption : null;

    return (
      <FilmSelect
        {...filmSelectProps}
        {...flags}
        // inputValueRenderer={this.renderInputValue}
        createNewItemFromQuery={maybeCreateNewItemFromQuery}
        createNewItemRenderer={maybeCreateNewItemRenderer}
        disabled={disabled}
        itemDisabled={this.isItemDisabled}
        itemsEqual={areFilmsEqual}
        // we may customize the default filmSelectProps.items by
        // adding newly created items to the list, so pass our own
        items={items}
        initialContent={initialContent}
        noResults={<MenuItem disabled={true} text="No results." />}
        onItemSelect={this.handleValueChange}
        popoverProps={{ minimal, boundary: 'viewport', position: 'bottom', fill: true }}
        inputProps={{
          placeholder: '选择数据集..',
        }}
      >
        <Button
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          fill={true}
          rightIcon="double-caret-vertical"
          text={dataset ? dataset.datasetName : '(No selection)'}
          disabled={disabled}
        />
      </FilmSelect>
    );
  }

  handleValueChange = (dataset: IDataset) => {
    // Delete the old dataset from the list if it was newly created.
    const { createdItems, items } = maybeDeleteCreatedFilmFromArrays(
      this.state.items,
      this.state.createdItems,
      this.state.dataset
    );
    // Add the new dataset to the list if it is newly created.
    const { createdItems: nextCreatedItems, items: nextItems } = maybeAddCreatedFilmToArrays(
      items,
      createdItems,
      dataset
    );
    this.setState({ createdItems: nextCreatedItems, dataset, items: nextItems });
  };

  private isItemDisabled = (dataset: IDataset) => this.state.disableItems && dataset.datasetId < 1000;
}
