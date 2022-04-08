import * as React from 'react';
import { JuggleDV } from '@juggle-data-view/types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import { Button, Divider, MenuItem, Popover } from '@mui/material';

export interface Data {
  [key: string]: string | null | number;
}
interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export type OperationFieldMap = (compFieldName: string, sourceFieldName?: string) => void;

const TableHeaderCell: React.FC<{
  content: string;
  compFields: string[];
  operationFieldMap: OperationFieldMap;
  fieldMap: JuggleDV.Field[];
}> = ({ content, compFields, fieldMap, operationFieldMap }) => {
  const triggerRef = React.useRef<any>();
  const [isOpen, setOpen] = React.useState(false);

  const handleItemClick = (compFieldName: string, sourceFieldName: string) => {
    operationFieldMap(compFieldName, sourceFieldName);
  };

  const renderOptions = () => {
    return compFields.map((item) => {
      const isSelected = !!fieldMap.find(
        ({ compFieldName, sourceFieldName }) => compFieldName === item && sourceFieldName === content
      );
      return (
        <MenuItem key={item} onClick={() => handleItemClick(item, content)} selected={isSelected}>
          {item}
        </MenuItem>
      );
    });
  };

  return (
    <TableCell align="right">
      <Button size="small" ref={triggerRef} onClick={() => setOpen(true)}>
        {content}
      </Button>
      <Popover
        open={isOpen}
        anchorEl={triggerRef.current}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        onClose={() => setOpen(false)}
      >
        {renderOptions()}
      </Popover>
    </TableCell>
  );
};

const CustomPaginationActionsTable: React.FC<{
  rowsData: Data[];
  operationFieldMap: OperationFieldMap;
  fieldMap: JuggleDV.Field[];
}> = ({ rowsData, operationFieldMap, fieldMap }) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const rows = React.useMemo<Data[]>(() => {
    //no filter
    return rowsData || [];
  }, [rowsData]);
  const colSpan = (rows && rows[0] ? Object.keys(rows[0]).length : 0) + 1;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //Get table cell content. Resolve content type is object
  const getCellContent = (content: any) => {
    const contentType = typeof content;
    if (content === null || content === undefined || content === '') {
      return 'empty data';
    } else if (contentType === 'number' || contentType === 'string') {
      return content;
    } else {
      return content + '';
    }
  };

  const renderTableRow = (row: Data, index: number) => {
    const column = Object.keys(row);
    const firstKey = column[0];

    return (
      <TableRow key={row[firstKey]}>
        <TableCell component="th" scope="row">
          {index}
        </TableCell>
        {column.map((key) => {
          return (
            <TableCell key={key} align="right">
              {getCellContent(row[key])}
            </TableCell>
          );
        })}
      </TableRow>
    );
  };

  const compField = React.useMemo(() => {
    return Array.from(new Set(fieldMap.map(({ compFieldName }) => compFieldName)));
  }, [fieldMap]);

  const renderTableHeader = (rows: Data[]) => {
    //Get data field union set
    const column = Array.from(new Set(rows.reduce<string[]>((a, b) => [...a, ...Object.keys(b)], [])));
    return (
      <TableHead>
        <TableRow>
          <TableCell component="th" scope="row">
            No.\Field
          </TableCell>
          {column.map((key) => {
            return (
              <TableHeaderCell
                content={key}
                key={key}
                fieldMap={fieldMap}
                compFields={compField}
                operationFieldMap={operationFieldMap}
              />
            );
          })}
        </TableRow>
      </TableHead>
    );
  };

  return (
    <div>
      <Box
        sx={{
          typography: 'h4',
        }}
      >
        预览数据
      </Box>
      <Divider />
      <TableContainer
        style={{
          userSelect: 'none',
          marginTop: '5px',
        }}
        component={Paper}
      >
        <Table sx={{ maxWidth: 350 }} aria-label="custom pagination table">
          {renderTableHeader(rows)}
          <TableBody>
            {(rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map(
              renderTableRow
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10, 20, 50, { label: 'All', value: -1 }]}
                colSpan={colSpan}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CustomPaginationActionsTable;
