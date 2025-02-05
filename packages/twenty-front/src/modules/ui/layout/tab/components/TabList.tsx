import styled from '@emotion/styled';
import * as React from 'react';
import { IconComponent } from 'twenty-ui';

import { useTabList } from '@/ui/layout/tab/hooks/useTabList';
import { TabListScope } from '@/ui/layout/tab/scopes/TabListScope';

import { TabListFromUrlOptionalEffect } from '@/ui/layout/tab/components/TabListFromUrlOptionalEffect';
import { LayoutCard } from '@/ui/layout/tab/types/LayoutCard';
import { ScrollWrapper } from '@/ui/utilities/scroll/components/ScrollWrapper';
import { useEffect } from 'react';
import { Tab } from './Tab';

export type SingleTabProps = {
  title: string;
  Icon?: IconComponent;
  id: string;
  hide?: boolean;
  disabled?: boolean;
  pill?: string | React.ReactElement;
  cards?: LayoutCard[];
  logo?: string;
};

type TabListProps = {
  tabListInstanceId: string;
  tabs: SingleTabProps[];
  loading?: boolean;
  className?: string;
  behaveAsLinks?: boolean;
};

const StyledTabsContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  height: 40px;
  user-select: none;
  margin-bottom: -1px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const StyledContainer = styled.div`
  border-bottom: ${({ theme }) => `1px solid ${theme.border.color.light}`};
`;

export const TabList = ({
  tabs,
  tabListInstanceId,
  loading,
  className,
  behaveAsLinks = true,
}: TabListProps) => {
  const visibleTabs = tabs.filter((tab) => !tab.hide);

  const { activeTabId, setActiveTabId } = useTabList(tabListInstanceId);

  const initialActiveTabId = activeTabId || visibleTabs[0]?.id || '';

  useEffect(() => {
    setActiveTabId(initialActiveTabId);
  }, [initialActiveTabId, setActiveTabId]);

  if (visibleTabs.length <= 1) {
    return null;
  }

  return (
    <StyledContainer className={className}>
      <TabListScope tabListScopeId={tabListInstanceId}>
        <TabListFromUrlOptionalEffect
          componentInstanceId={tabListInstanceId}
          tabListIds={tabs.map((tab) => tab.id)}
        />
        <ScrollWrapper
          defaultEnableYScroll={false}
          contextProviderName="tabList"
          componentInstanceId={`scroll-wrapper-tab-list-${tabListInstanceId}`}
        >
          <StyledTabsContainer>
            {visibleTabs.map((tab) => (
              <Tab
                id={tab.id}
                key={tab.id}
                title={tab.title}
                Icon={tab.Icon}
                logo={tab.logo}
                active={tab.id === activeTabId}
                disabled={tab.disabled ?? loading}
                pill={tab.pill}
                to={behaveAsLinks ? `#${tab.id}` : undefined}
                onClick={() => {
                  if (!behaveAsLinks) {
                    setActiveTabId(tab.id);
                  }
                }}
              />
            ))}
          </StyledTabsContainer>
        </ScrollWrapper>
      </TabListScope>
    </StyledContainer>
  );
};
