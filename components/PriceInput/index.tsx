import { ChangeEvent, KeyboardEvent, Dispatch, SetStateAction } from 'react';
import { Input } from './PriceInput.styled';
import { TOKEN_PRECISION } from '../../utils/constants';

type Props = {
  setAmount: Dispatch<SetStateAction<string>>;
  amount: string;
  placeholder: string;
  submit: () => Promise<void>;
};

const PriceInput = ({
  setAmount,
  amount,
  placeholder,
  submit,
}: Props): JSX.Element => {
  const updateNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const inputAmount = e.target.value;
    const floatAmount = parseFloat(inputAmount);
    const formattedAmount = floatAmount.toFixed(TOKEN_PRECISION);

    if (floatAmount < 0) {
      setAmount('0');
      return;
    }

    if (floatAmount > 1000000000) {
      setAmount('1000000000');
      return;
    }

    if (inputAmount.length > formattedAmount.length) {
      setAmount(formattedAmount);
      return;
    }

    setAmount(inputAmount);
  };

  const formatNumber = () => {
    const numberAmount = parseFloat(amount).toFixed(TOKEN_PRECISION);
    setAmount(numberAmount);
  };

  const ignoreInvalidCharacters = (e: KeyboardEvent) => {
    const invalidChars = ['-', '+', 'e'];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === 'Enter') {
      submit();
    }
  };

  return (
    <Input
      required
      type="number"
      min="0"
      max="1000000000"
      step={1 / 10 ** TOKEN_PRECISION}
      inputMode="decimal"
      placeholder={placeholder}
      value={amount}
      onBlur={formatNumber}
      onChange={updateNumber}
      onKeyDown={ignoreInvalidCharacters}
    />
  );
};

export default PriceInput;
