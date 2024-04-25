import { ReactNode, useState } from 'react';
import { IconVariant } from './DfxIcon';
import StyledTab from './StyledTab';

interface StyledTabContainerProps {
  tabs: Array<StyledTabProps>;
  activeTab?: number;
  darkTheme?: boolean;
  spread?: boolean;
}

export interface StyledTabProps {
  title: string;
  deactivated?: boolean;
  content: ReactNode | undefined;
  icon?: IconVariant;
  flagWord1?: string;
  flagWord2?: string;
  onActivate?: () => void;
}

export default function StyledTabContainer({ tabs, activeTab = 0, darkTheme, spread }: StyledTabContainerProps) {
  const [active, setActive] = useState(activeTab);

  return (
    <>
      <div className="flex flex-wrap text-dfxBlue-800">
        <div className={`w-full rounded-lg ${darkTheme ? 'border border-dfxGray-400' : ''}`}>
          <ul
            className={`flex mb-0 rounded-t-lg list-none flex-wrap p-0 flex-row ${
              darkTheme ? 'bg-dfxGray-400' : 'bg-white/50'
            }`}
            role="tablist"
          >
            {tabs.map((tab: StyledTabProps, index: number) => {
              return (
                <StyledTab
                  setActive={() => {
                    setActive(index);
                    tab.onActivate?.();
                  }}
                  active={index === active}
                  deactivated={tab.deactivated}
                  key={index}
                  icon={tab.icon}
                  flagWord1={tab.flagWord1}
                  flagWord2={tab.flagWord2}
                  darkTheme={darkTheme}
                  spread={spread}
                >
                  {tab.title}
                </StyledTab>
              );
            })}
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full rounded-b-lg">
            <div className="p-8 flex-auto">
              <div className="tab-content tab-space">{tabs[active].content}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
