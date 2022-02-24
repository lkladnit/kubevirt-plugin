import * as React from 'react';

import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';

import DiskListPage from '../components/disk/DiskListPage';
import NetworkInterfaceListPage from '../components/network/NetworkInterfaceListPage';

export const useVirtualMachineTabs = () => {
  const { t } = useKubevirtTranslation();

  const tabs = React.useMemo(
    () => [
      {
        href: '',
        name: t('Overview'),
        component: React.Fragment,
      },
      {
        href: 'details',
        name: t('Details'),
        component: React.Fragment,
      },
      {
        href: 'yaml',
        name: 'YAML',
        component: React.Fragment,
      },
      {
        href: 'enviornment',
        name: t('Enviornment'),
        component: React.Fragment,
      },
      {
        href: 'events',
        name: t('Events'),
        component: React.Fragment,
      },
      {
        href: 'console',
        name: t('Console'),
        component: React.Fragment,
      },
      {
        href: 'network-interfaces',
        name: t('Network Interfaces'),
        component: NetworkInterfaceListPage,
      },
      {
        href: 'disks',
        name: t('Disks'),
        component: DiskListPage,
      },
      {
        href: 'snapshots',
        name: t('Snapshots'),
        component: React.Fragment,
      },
    ],
    [t],
  );

  return tabs;
};
