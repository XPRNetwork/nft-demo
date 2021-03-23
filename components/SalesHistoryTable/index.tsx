import { useState, useEffect } from 'react';
import TableHeaderRow from '../TableHeaderRow';
import TableHeaderCell from '../TableHeaderCell';
import TableRow from '../TableRow';
import TableContentWrapper from '../TableContentWraper';
import SalesHistoryTableCell from '../SalesHistoryTableCell';
import { Sale } from '../../services/sales';
import { addPrecisionDecimal, parseTimestamp } from '../../utils';
import { StyledTable } from './SalesHistoryTable.styled';
import { useWindowSize } from '../../hooks';
import { getFromApi } from '../../utils/browser-fetch';
import { useAuthContext } from '../Provider';

type Props = {
  tableData: Sale[];
  error?: string;
};

type TableHeader = {
  title: string;
  id: string;
};

const salesHistoryTableHeaders = [
  { title: '', id: 'img' },
  { title: 'BUYER', id: 'buyer' },
  { title: 'PRICE', id: 'price' },
  { title: 'SERIAL', id: 'serial' },
  { title: 'DATE/TIME', id: 'date' },
  { title: 'TX', id: 'tx' },
];

const mobileSalesHistoryTableHeaders = [
  { title: '', id: 'img' },
  { title: 'BUYER', id: 'buyer' },
  { title: 'PRICE', id: 'price' },
  { title: 'TX', id: 'tx' },
];

const getAvatars = async (
  chainAccounts: string[]
): Promise<{ [chainAccount: string]: string }> => {
  try {
    const queryString = chainAccounts
      .map((account) => encodeURIComponent(account))
      .join('&accounts=');

    const res = await getFromApi<{ [account: string]: string }>(
      `/api/profile?accounts=${queryString}`
    );

    if (!res.success) {
      throw new Error((res.message as unknown) as string);
    }

    return res.message;
  } catch (e) {
    throw new Error(e);
  }
};

const SalesHistoryTable = ({ tableData, error }: Props): JSX.Element => {
  const { currentUser } = useAuthContext();
  const [avatars, setAvatars] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableHeaders, setTableHeaders] = useState<TableHeader[]>([]);
  const { isMobile } = useWindowSize();

  useEffect(() => {
    if (isMobile) {
      setTableHeaders(mobileSalesHistoryTableHeaders);
    } else {
      setTableHeaders(salesHistoryTableHeaders);
    }
  }, [isMobile]);

  useEffect(() => {
    (async () => {
      if (tableData.length) {
        const chainAccounts = tableData.map(({ buyer }) => buyer);
        const res = await getAvatars(chainAccounts);
        setAvatars(res);
      }
      setIsLoading(false);
    })();
  }, [tableData]);

  useEffect(() => {
    if (currentUser) {
      setAvatars({
        ...avatars,
        [currentUser.actor]: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const getTableContent = () => {
    return tableData.map((sale) => {
      return (
        <TableRow key={sale.sale_id}>
          {tableHeaders.map(({ id }) => {
            const content = getCellContent(sale, id, avatars);
            return <SalesHistoryTableCell key={id} id={id} content={content} />;
          })}
        </TableRow>
      );
    });
  };

  return (
    <StyledTable aria-label="sales-history-table" role="table">
      <thead>
        <TableHeaderRow>
          {tableHeaders.map((header) => {
            return (
              <TableHeaderCell key={header.title}>
                {header.title}
              </TableHeaderCell>
            );
          })}
        </TableHeaderRow>
      </thead>
      <tbody>
        <TableContentWrapper
          error={error ? 'An error has occurred' : null}
          loading={isLoading}
          noData={!tableData.length}
          noDataMessage={'No Recent Sales'}
          columns={tableHeaders.length}>
          {getTableContent()}
        </TableContentWrapper>
      </tbody>
    </StyledTable>
  );
};

const getCellContent = (sale, id, avatars) => {
  switch (id) {
    case 'img': {
      return avatars[sale.buyer];
    }
    case 'buyer': {
      return sale.buyer;
    }
    case 'price': {
      const { amount, token_precision, token_symbol } = sale.price;
      const price = `${addPrecisionDecimal(
        amount,
        token_precision
      )} ${token_symbol}`;
      return price;
    }
    case 'serial': {
      const { assets, asset_serial } = sale;
      const asset = assets[0];
      const serial = asset.template_mint;
      return asset_serial || serial;
    }
    case 'date': {
      const timeInUnix = sale.updated_at_time;
      const date = parseTimestamp(timeInUnix);
      return date;
    }
    case 'tx': {
      return sale.updated_at_block;
    }
  }
};

export default SalesHistoryTable;
