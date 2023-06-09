import { PropsWithChildren } from 'react';
import { IconColor, IconSize, IconVariant } from './DfxIcon';
import StyledIconButton from './StyledIconButton';

export enum StyledModalColor {
  WHITE = 'WHITE',
  DFX_GRADIENT = 'DFX_GRADIENT',
}

export enum StyledModalType {
  REGULAR = 'REGULAR',
  ALERT = 'ALERT',
}

export enum StyledModalWidth {
  NONE = 'NONE',
  SMALL = 'SMALL',
  REGULAR = 'REGULAR',
  LARGE = 'LARGE',
  FULL_WIDTH = 'FULL_WIDTH',
}

const WIDTH_MAPS: Record<StyledModalWidth, string> = {
  [StyledModalWidth.NONE]: 'w-[90%]',
  [StyledModalWidth.SMALL]: 'min-w-[25rem] max-w-lg',
  [StyledModalWidth.REGULAR]: 'min-w-[37.5rem] max-w-2xl',
  [StyledModalWidth.LARGE]: 'w-[90%] max-w-4xl',
  [StyledModalWidth.FULL_WIDTH]: 'w-[90%] max-w-7xl',
};

interface StyledModalProps extends PropsWithChildren {
  isVisible: boolean;
  onClose?: (showModal: boolean) => any;
  closeWithX?: boolean;
  heading?: string;
  color?: StyledModalColor;
  type?: StyledModalType;
  width?: StyledModalWidth;
}

export default function StyledModal({
  isVisible,
  type = StyledModalType.REGULAR,
  color = StyledModalColor.DFX_GRADIENT,
  onClose,
  heading,
  closeWithX = true,
  children,
  width = StyledModalWidth.REGULAR,
}: StyledModalProps) {
  function setShowModal(modalState: boolean) {
    onClose?.(modalState);
  }

  const showHeader = heading !== undefined && heading !== '' && type === StyledModalType.REGULAR;

  const parentClasses = 'relative my-6 mx-auto ' + WIDTH_MAPS[width];
  let containerClasses =
    'rounded-lg shadow-lg max-h-[80vh] relative flex flex-col w-full outline-none focus:outline-none overflow-auto';
  let headingClasses = 'p-3 border-b rounded-t';
  let bodyClasses =
    `relative pb-10 ${width === StyledModalWidth.NONE ? 'px-4' : 'px-14'} flex-auto overflow-auto` + WIDTH_MAPS[width];

  if (type !== StyledModalType.ALERT) {
    containerClasses +=
      color === StyledModalColor.DFX_GRADIENT
        ? ' bg-dfxGradient text-white border border-white/20'
        : ' bg-white text-dfxBlue-800';
    headingClasses += color === StyledModalColor.DFX_GRADIENT ? ' border-white/20' : ' border-dfxGray-400';
  } else {
    containerClasses +=
      color === StyledModalColor.WHITE ? ' bg-white text-dfxBlue-800' : ' bg-dfxGray-400 text-dfxBlue-800';
    bodyClasses += ' text-center';
  }

  showHeader ? (bodyClasses += ' pt-6') : (bodyClasses += ' pt-12');

  const zIndex = type === StyledModalType.ALERT ? 'z-[100]' : 'z-40';

  return (
    <>
      {isVisible && (
        <>
          <div
            className={`justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 ${zIndex} outline-none focus:outline-none`}
          >
            <div className={parentClasses}>
              {/*content*/}
              <div className={containerClasses}>
                {closeWithX && type === StyledModalType.REGULAR && (
                  <div className="absolute right-4 top-4 z-50">
                    <StyledIconButton
                      color={color === StyledModalColor.DFX_GRADIENT ? IconColor.WHITE : IconColor.BLUE}
                      size={IconSize.LG}
                      icon={IconVariant.CLOSE}
                      onClick={() => setShowModal(false)}
                    />
                  </div>
                )}
                {/*header*/}
                {showHeader && (
                  <div className={headingClasses}>
                    <h3
                      className={`text-lg font-bold ${width === StyledModalWidth.NONE ? 'text-start' : 'text-center'}`}
                    >
                      {heading}
                    </h3>
                  </div>
                )}
                {/*body*/}
                <div className={bodyClasses}>{children}</div>
              </div>
            </div>
          </div>
          <div className="opacity-30 fixed inset-0 z-30 bg-black"></div>
        </>
      )}
    </>
  );
}
