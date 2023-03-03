import { Tab } from './Tab';
import { TabsNavigationProps } from './types';

export const TabsNavigation = ({ tabs }: TabsNavigationProps) => {
  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-5">
        {tabs.map((tab) => {
          return <Tab key={tab.href} {...tab} />;
        })}
      </div>
    </div>
  );
};
