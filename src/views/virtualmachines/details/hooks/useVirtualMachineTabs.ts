import * as React from 'react';

import {
  VirtualMachineDetailsTab,
  VirtualMachineDetailsTabLabel,
} from '@kubevirt-utils/components/PendingChanges/utils/constants';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';

import VirtualMachineConsolePage from '../tabs/console/VirtualMachineConsolePage';
import VirtualMachineDetailsPage from '../tabs/details/VirtualMachineDetailsPage';
import DiskListPage from '../tabs/disk/tables/disk/DiskListPage';
import VirtualMachineEnvironmentPage from '../tabs/environment/VirtualMachineEnvironmentPage';
import NetworkInterfaceListPage from '../tabs/network/NetworkInterfaceListPage';
import VirtualMachinesOverviewTab from '../tabs/overview/VirtualMachinesOverviewTab';
import SnapshotListPage from '../tabs/snapshots/SnapshotListPage';
import VirtualMachineYAMLPage from '../tabs/yaml/VirtualMachineYAMLPage';

export const useVirtualMachineTabs = () => {
  const { t } = useKubevirtTranslation();

  const tabs = React.useMemo(
    () => [
      {
        href: VirtualMachineDetailsTab.Overview,
        name: t(VirtualMachineDetailsTabLabel.Overview),
        component: VirtualMachinesOverviewTab,
      },
      {
        href: VirtualMachineDetailsTab.Details,
        name: t(VirtualMachineDetailsTabLabel.Details),
        component: VirtualMachineDetailsPage,
      },
      {
        href: VirtualMachineDetailsTab.YAML,
        name: t(VirtualMachineDetailsTabLabel.YAML),
        component: VirtualMachineYAMLPage,
      },
      {
        href: VirtualMachineDetailsTab.Environment,
        name: t(VirtualMachineDetailsTabLabel.Environment),
        component: VirtualMachineEnvironmentPage,
      },
      {
        href: VirtualMachineDetailsTab.Events,
        name: t(VirtualMachineDetailsTabLabel.Events),
        component: React.Fragment,
      },
      {
        href: VirtualMachineDetailsTab.Console,
        name: t(VirtualMachineDetailsTabLabel.Console),
        component: VirtualMachineConsolePage,
      },
      {
        href: VirtualMachineDetailsTab.NetworkInterfaces,
        name: t(VirtualMachineDetailsTabLabel.NetworkInterfaces),
        component: NetworkInterfaceListPage,
      },
      {
        href: VirtualMachineDetailsTab.Disks,
        name: t(VirtualMachineDetailsTabLabel.Disks),
        component: DiskListPage,
      },
      {
        href: VirtualMachineDetailsTab.Snapshots,
        name: t(VirtualMachineDetailsTabLabel.Snapshots),
        component: SnapshotListPage,
      },
    ],
    [t],
  );

  return tabs;
};
