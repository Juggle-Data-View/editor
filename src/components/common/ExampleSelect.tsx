/**
 * Blueprint Example Select Component DEMO
 */

import * as React from 'react';
import { MenuItem, Button, H5, Switch, Drawer, Classes } from '@blueprintjs/core';
import { Select, ItemPredicate, ItemRenderer } from '@blueprintjs/select';
import styled from 'styled-components';

// 数据接口类型
interface IFilm {
  /** Title of film. */
  title: string;
  /** Release year. */
  year: number;
  /** IMDb ranking. */
  rank: number;
}

/** Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top */
const TOP_10_FILMS: IFilm[] = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
].map((m, index) => ({ ...m, rank: index + 1 }));

const renderFilm: ItemRenderer<IFilm> = (film, { handleClick, modifiers, query }) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }
  const text = `${film.rank}. ${film.title}`;
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      label={film.year.toString()}
      key={film.rank}
      onClick={handleClick}
      text={highlightText(text, query)}
    />
  );
};

const renderCreateFilmOption = (query: string, active: boolean, handleClick: React.MouseEventHandler<HTMLElement>) => (
  <MenuItem icon="add" text={`Create "${query}"`} active={active} onClick={handleClick} shouldDismissPopover={false} />
);

const filterFilm: ItemPredicate<IFilm> = (query, film, _index, exactMatch) => {
  const normalizedTitle = film.title.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${film.rank}. ${normalizedTitle} ${film.year}`.indexOf(normalizedQuery) >= 0;
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
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'); // eslint-disable-line
}

const filmSelectProps = {
  itemPredicate: filterFilm,
  itemRenderer: renderFilm,
  items: TOP_10_FILMS,
};

function createFilm(title: string): IFilm {
  return {
    rank: 100 + Math.floor(Math.random() * 100 + 1),
    title,
    year: new Date().getFullYear(),
  };
}

function areFilmsEqual(filmA: IFilm, filmB: IFilm) {
  // Compare only the titles (ignoring case) just for simplicity.
  return filmA.title.toLowerCase() === filmB.title.toLowerCase();
}

// function doesFilmEqualQuery(film: IFilm, query: string) {
//   return film.title.toLowerCase() === query.toLowerCase();
// }

function arrayContainsFilm(films: IFilm[], filmToFind: IFilm): boolean {
  return films.some((film: IFilm) => film.title === filmToFind.title);
}

function addFilmToArray(films: IFilm[], filmToAdd: IFilm) {
  return [...films, filmToAdd];
}

function deleteFilmFromArray(films: IFilm[], filmToDelete: IFilm) {
  return films.filter((film) => film !== filmToDelete);
}

function maybeAddCreatedFilmToArrays(
  items: IFilm[],
  createdItems: IFilm[],
  film: IFilm
): { createdItems: IFilm[]; items: IFilm[] } {
  const isNewlyCreatedItem = !arrayContainsFilm(items, film);
  return {
    createdItems: isNewlyCreatedItem ? addFilmToArray(createdItems, film) : createdItems,
    // Add a created film to `items` so that the film can be deselected.
    items: isNewlyCreatedItem ? addFilmToArray(items, film) : items,
  };
}

function maybeDeleteCreatedFilmFromArrays(
  items: IFilm[],
  createdItems: IFilm[],
  film: IFilm
): { createdItems: IFilm[]; items: IFilm[] } {
  const wasItemCreatedByUser = arrayContainsFilm(createdItems, film);

  // Delete the item if the user manually created it.
  return {
    createdItems: wasItemCreatedByUser ? deleteFilmFromArray(createdItems, film) : createdItems,
    items: wasItemCreatedByUser ? deleteFilmFromArray(items, film) : items,
  };
}

const ExampleWrapper = styled.div`
  display: flex;
  .demo {
    width: 500px;
  }
  .option {
    width: 300px;
  }
`;

const Example = (props: any) => {
  return (
    <ExampleWrapper>
      <div className="demo">{props.children}</div>
      <div className="option">{props.options}</div>
    </ExampleWrapper>
  );
};

const FilmSelect = Select.ofType<IFilm>();

export interface ISelectExampleState {
  allowCreate: boolean; // 是否允许创建新数据，在未搜索到数据时
  createdItems: IFilm[]; // 被创建的条目
  film: IFilm; // Data list
  filterable: boolean; // Filterable
  hasInitialContent: boolean; // Use initial content
  items: IFilm[]; // {...{itemPredicate, itemRenderer, items}}
  minimal: boolean; // Minimal popover style
  resetOnClose: boolean; // Reset on close
  resetOnQuery: boolean; // Reset on query
  resetOnSelect: boolean; // Reset on select
  disableItems: boolean; // Disable films before 2000
  disabled: boolean; // Disabled
}

class DEMO extends React.PureComponent<any, any> {
  public state: ISelectExampleState = {
    allowCreate: true,
    createdItems: [],
    disableItems: false,
    disabled: false,
    film: TOP_10_FILMS[0],
    filterable: true,
    hasInitialContent: false,
    items: filmSelectProps.items,
    minimal: false,
    resetOnClose: false,
    resetOnQuery: true,
    resetOnSelect: false,
  };

  private handleAllowCreateChange = this.handleSwitchChange('allowCreate');
  private handleDisabledChange = this.handleSwitchChange('disabled');
  private handleFilterableChange = this.handleSwitchChange('filterable');
  private handleInitialContentChange = this.handleSwitchChange('hasInitialContent');
  private handleItemDisabledChange = this.handleSwitchChange('disableItems');
  private handleMinimalChange = this.handleSwitchChange('minimal');
  private handleResetOnCloseChange = this.handleSwitchChange('resetOnClose');
  private handleResetOnQueryChange = this.handleSwitchChange('resetOnQuery');
  private handleResetOnSelectChange = this.handleSwitchChange('resetOnSelect');

  public render() {
    const { allowCreate, disabled, disableItems, film, minimal, ...flags } = this.state;

    const initialContent = this.state.hasInitialContent ? (
      <MenuItem disabled={true} text={`${TOP_10_FILMS.length} items loaded.`} />
    ) : undefined;
    const maybeCreateNewItemFromQuery = allowCreate ? createFilm : undefined;
    const maybeCreateNewItemRenderer: any = allowCreate ? renderCreateFilmOption : null;

    return (
      <Example options={this.renderOptions()}>
        <FilmSelect
          {...filmSelectProps}
          {...flags}
          createNewItemFromQuery={maybeCreateNewItemFromQuery}
          createNewItemRenderer={maybeCreateNewItemRenderer}
          disabled={disabled}
          itemDisabled={this.isItemDisabled}
          itemsEqual={areFilmsEqual}
          // we may customize the default filmSelectProps.items by
          // adding newly created items to the list, so pass our own
          items={this.state.items}
          initialContent={initialContent}
          noResults={<MenuItem disabled={true} text="No results." />}
          onItemSelect={this.handleValueChange}
          popoverProps={{ minimal, boundary: 'viewport', position: 'bottom-left' }}
        >
          <Button
            fill={true}
            icon="film"
            rightIcon="caret-down"
            text={film ? `${film.title} (${film.year})` : '(No selection)'}
            disabled={disabled}
          />
        </FilmSelect>
      </Example>
    );
  }

  protected renderOptions() {
    return (
      <>
        <H5>Props</H5>
        <Switch label="Disabled" checked={this.state.disabled} onChange={this.handleDisabledChange} />
        <Switch label="Filterable" checked={this.state.filterable} onChange={this.handleFilterableChange} />
        <Switch label="Reset on close" checked={this.state.resetOnClose} onChange={this.handleResetOnCloseChange} />
        <Switch label="Reset on query" checked={this.state.resetOnQuery} onChange={this.handleResetOnQueryChange} />
        <Switch label="Reset on select" checked={this.state.resetOnSelect} onChange={this.handleResetOnSelectChange} />
        <Switch
          label="Use initial content"
          checked={this.state.hasInitialContent}
          onChange={this.handleInitialContentChange}
        />
        <Switch
          label="Disable films before 2000"
          checked={this.state.disableItems}
          onChange={this.handleItemDisabledChange}
        />
        <Switch
          label="Allow creating new items"
          checked={this.state.allowCreate}
          onChange={this.handleAllowCreateChange}
        />
        <H5>Popover props</H5>
        <Switch label="Minimal popover style" checked={this.state.minimal} onChange={this.handleMinimalChange} />
      </>
    );
  }

  private handleValueChange = (film: IFilm) => {
    // Delete the old film from the list if it was newly created.
    const { createdItems, items } = maybeDeleteCreatedFilmFromArrays(
      this.state.items,
      this.state.createdItems,
      this.state.film
    );
    // Add the new film to the list if it is newly created.
    const { createdItems: nextCreatedItems, items: nextItems } = maybeAddCreatedFilmToArrays(items, createdItems, film);
    this.setState({ createdItems: nextCreatedItems, film, items: nextItems });
  };

  private handleSwitchChange(prop: keyof ISelectExampleState) {
    return (event: React.FormEvent<HTMLInputElement>) => {
      const checked = event.currentTarget.checked;
      this.setState((state: any) => ({ ...state, [prop]: checked }));
    };
  }

  private isItemDisabled = (film: IFilm) => this.state.disableItems && film.year < 2000;
}

export default class ExampleSelect extends React.Component {
  state = {
    isOpen: false,
  };

  handleOpen = () => this.setState({ isOpen: true });
  handleClose = () => this.setState({ isOpen: false });

  render() {
    return (
      <>
        <Button onClick={this.handleOpen} icon="select" text="Select DEMO" />
        <Drawer
          onClose={this.handleClose}
          title="Select DEMO"
          className={Classes.DARK}
          isOpen={this.state.isOpen}
          size="auto"
        >
          <div className={Classes.DRAWER_BODY}>
            <div className={Classes.DIALOG_BODY}>
              <DEMO />
            </div>
          </div>
          <div className={Classes.DRAWER_FOOTER}>Footer</div>
        </Drawer>
      </>
    );
  }
}
