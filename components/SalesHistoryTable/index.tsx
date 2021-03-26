import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TableHeaderRow from '../TableHeaderRow';
import TableHeaderCell from '../TableHeaderCell';
import TableRow from '../TableRow';
import TableContentWrapper from '../TableContentWraper';
import SalesHistoryTableCell from '../SalesHistoryTableCell';
import PaginationButton from '../../components/PaginationButton';
import { Sale } from '../../services/sales';
import { addPrecisionDecimal, parseTimestamp } from '../../utils';
import { StyledTable } from './SalesHistoryTable.styled';
import { useWindowSize } from '../../hooks';
import { getFromApi } from '../../utils/browser-fetch';
import { useAuthContext } from '../Provider';
import { getSalesHistoryForTemplate } from '../../services/sales';

type Props = {
  tableData: Sale[];
  id: string;
  error?: string;
  serialFilter?: string;
};

type TableHeader = {
  title: string;
  id: string;
};

type GetSalesOptions = {
  id: string;
  page?: number;
  serialFilter?: string;
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

const getMySalesHistory = async ({
  id,
  page,
  serialFilter,
}: GetSalesOptions): Promise<Sale[]> => {
  try {
    const pageParam = page ? page : 1;
    const result = await getSalesHistoryForTemplate(
      id,
      serialFilter,
      pageParam
    );

    return result;
  } catch (e) {
    throw new Error(e);
  }
};

const SalesHistoryTable = ({
  tableData,
  id,
  error,
  serialFilter,
}: Props): JSX.Element => {
  const { currentUser } = useAuthContext();
  const router = useRouter();
  const [avatars, setAvatars] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingNextPage, setIsLoadingNextPage] = useState<boolean>(true);
  const [renderedData, setRenderedData] = useState<Sale[]>([]);
  const [prefetchedData, setPrefetchedData] = useState<Sale[]>([]);
  const [prefetchPageNumber, setPrefetchPageNumber] = useState<number>(2);
  const [errorMessage, setErrorMessage] = useState<string>(error);
  const [tableHeaders, setTableHeaders] = useState<TableHeader[]>([]);
  const { isMobile } = useWindowSize();

  useEffect(() => {
    setRenderedData(tableData);
  }, [tableData]);

  useEffect(() => {
    if (isMobile) {
      setTableHeaders(mobileSalesHistoryTableHeaders);
    } else {
      setTableHeaders(salesHistoryTableHeaders);
    }
  }, [isMobile]);

  useEffect(() => {
    (async () => {
      try {
        if (renderedData.length) {
          const chainAccounts = renderedData.map(({ buyer }) => buyer);
          const res = await getAvatars(chainAccounts);
          setAvatars(res);
        }
        if (renderedData.length % 10 == 0) {
          router.prefetch('/');
          await prefetchNextPage();
        }
      } catch (e) {
        setErrorMessage(e.message);
      }
      setIsLoading(false);
    })();
  }, [renderedData]);

  useEffect(() => {
    if (currentUser) {
      setAvatars({
        ...avatars,
        [currentUser.actor]: currentUser.avatar,
      });
    }
  }, [currentUser]);

  const getTableContent = () => {
    return renderedData.map((sale, i) => {
      return (
        <TableRow key={i}>
          {tableHeaders.map(({ id }) => {
            const content = getCellContent(sale, id, avatars);
            return <SalesHistoryTableCell key={id} id={id} content={content} />;
          })}
        </TableRow>
      );
    });
  };

  const prefetchNextPage = async () => {
    const prefetchedResult = await getMySalesHistory({
      id,
      page: prefetchPageNumber,
      serialFilter,
    });
    setPrefetchedData(prefetchedResult as Sale[]);

    if (!prefetchedResult.length) {
      setPrefetchPageNumber(-1);
    } else {
      setPrefetchPageNumber(prefetchPageNumber + 1);
    }

    setIsLoadingNextPage(false);
  };

  const showNextPage = async () => {
    const allFetchedData = renderedData.concat(prefetchedData);
    setRenderedData(allFetchedData);
    setIsLoadingNextPage(true);
    await prefetchNextPage();
  };

  return (
    <>
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
            error={
              errorMessage ? `An error has occurred: ${errorMessage}` : null
            }
            loading={isLoading}
            noData={!renderedData.length}
            noDataMessage={'No Recent Sales'}
            columns={tableHeaders.length}>
            {getTableContent()}
          </TableContentWrapper>
        </tbody>
      </StyledTable>
      <PaginationButton
        onClick={showNextPage}
        isLoading={isLoadingNextPage}
        disabled={prefetchPageNumber === -1}
      />
    </>
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
