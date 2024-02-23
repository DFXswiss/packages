import StyledLoadingSpinner from './StyledLoadingSpinner';
import StyledVerticalStack from './layout-helpers/StyledVerticalStack';

interface StyledTextBoxProps {
  darkTheme?: boolean;
  full?: boolean;
  text: string;
  label?: string;
  smallLabel?: boolean;
  loading?: boolean;
}

const StyledTextBox = ({
  darkTheme = false,
  full = false,
  text,
  label,
  smallLabel,
  loading = false,
}: StyledTextBoxProps) => {
  const textColor = darkTheme ? 'text-white' : 'text-dfxBlue-800';
  const backgroundColor = darkTheme ? 'bg-white bg-opacity-5' : 'bg-white';
  const placeholderColor = darkTheme ? 'placeholder:text-dfxGray-800' : 'placeholder:text-dfxGray-600';
  const borderColor = darkTheme ? 'border-none' : 'border border-dfxGray-500';
  const outlineColor = darkTheme ? 'outline-none' : 'outline-2 outline-dfxBlue-400';

  return (
    <StyledVerticalStack gap={1} full={full}>
      {label && (
        <label
          className={
            `text-start ${smallLabel ? 'text-sm' : 'text-base'} font-semibold pl-3 pl- ` + [textColor].join(' ')
          }
        >
          {label}
        </label>
      )}

      <div
        className={
          ` relative text-base font-normal rounded-md w-full ` +
          [textColor, backgroundColor, placeholderColor, borderColor, outlineColor].join(' ')
        }
      >
        {loading && (
          <div className="absolute right-3 h-w-8 flex justify-center items-center h-[3.6rem]">
            <StyledLoadingSpinner />
          </div>
        )}

        <div className={`p-4 w-full ${textColor}`}>
          <div className="flex-1 whitespace-pre">{text}</div>
        </div>
      </div>
    </StyledVerticalStack>
  );
};
export default StyledTextBox;
