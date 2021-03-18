import TableDataCell from '../TableDataCell';
import Image from 'next/image';
import Link from 'next/link';
import { AvatarImage, ImageDataCell } from './SalesHistoryTabelCell.styled';

type Props = {
  id: string;
  content: string;
};

const SalesHistoryTableCell = ({ id, content }: Props): JSX.Element => {
  switch (id) {
    case 'img': {
      return (
        <ImageDataCell>
          <AvatarImage
            priority
            width={32}
            height={32}
            src={
              content
                ? `data:image/jpeg;base64,${content}`
                : '/default-avatar.png'
            }
          />
        </ImageDataCell>
      );
    }
    case 'serial': {
      return <TableDataCell>#{content}</TableDataCell>;
    }
    case 'tx': {
      return (
        <ImageDataCell align="left">
          <Link
            href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}${content}`}
            passHref>
            <a target="_blank" rel="noreferrer">
              <Image
                layout="fixed"
                priority
                width={24}
                height={24}
                src="/launch.svg"
              />
            </a>
          </Link>
        </ImageDataCell>
      );
    }
    default: {
      return <TableDataCell>{content}</TableDataCell>;
    }
  }
};

export default SalesHistoryTableCell;
