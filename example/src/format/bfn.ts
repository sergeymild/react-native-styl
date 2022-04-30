type BigNumberish = number | string | BigNumber;
/**
 * @desc convert from amount value to display formatted string
 */
export const convertAmountToNativeDisplay = (
  value: BigNumberish,
  nativeCurrency: string,
  buffer?: number,
  skipDecimals?: boolean
) => {
  const display = handleSignificantDecimals(
    value,
    decimals,
    buffer,
    skipDecimals
  );
  return display;
};

const bfn = (num, nativeCurrency, skipDecimals) => {
  let ret;
  if (num > 1000000000) {
    ret = `${convertAmountToNativeDisplay(
      (num / 1000000000).toString(),
      nativeCurrency
    )}b`;
  } else if (num > 1000000) {
    ret = `${convertAmountToNativeDisplay(
      (num / 1000000).toString(),
      nativeCurrency
    )}m`;
  } else {
    ret = convertAmountToNativeDisplay(
      num.toString(),
      nativeCurrency,
      3,
      skipDecimals
    );
    num.toFixed(2);
  }

  return ret;
};
