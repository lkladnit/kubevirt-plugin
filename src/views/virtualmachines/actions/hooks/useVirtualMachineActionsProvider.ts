import { useMemo } from 'react';

import {
  V1VirtualMachine,
  V1VirtualMachineInstanceMigration,
} from '@kubevirt-ui/kubevirt-api/kubevirt';
import { ActionDropdownItemType } from '@kubevirt-utils/components/ActionsDropdown/constants';
import { useModal } from '@kubevirt-utils/components/ModalProvider/ModalProvider';
import { getConsoleVirtctlCommand } from '@kubevirt-utils/components/SSHAccess/utils';
import { VirtualMachineModelRef } from '@kubevirt-utils/models';
import { vmimStatuses } from '@kubevirt-utils/resources/vmim/statuses';
import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk';

import { printableVMStatus } from '../../utils';
import { VirtualMachineActionFactory } from '../VirtualMachineActionFactory';

type UseVirtualMachineActionsProvider = (
  vm: V1VirtualMachine,
  vmim?: V1VirtualMachineInstanceMigration,
  isSingleNodeCluster?: boolean,
) => [ActionDropdownItemType[], boolean, any];

const useVirtualMachineActionsProvider: UseVirtualMachineActionsProvider = (
  vm,
  vmim,
  isSingleNodeCluster,
) => {
  const { createModal } = useModal();

  const virtctlCommand = getConsoleVirtctlCommand(vm);

  const [, inFlight] = useK8sModel(VirtualMachineModelRef);
  const actions: ActionDropdownItemType[] = useMemo(() => {
    const printableStatus = vm?.status?.printableStatus;
    const { Migrating, Paused } = printableVMStatus;

    const startOrStop = ((printableStatusMachine) => {
      const map = {
        default: VirtualMachineActionFactory.stop(vm),
        Stopped: VirtualMachineActionFactory.start(vm),
        Stopping: VirtualMachineActionFactory.forceStop(vm),
        Terminating: VirtualMachineActionFactory.forceStop(vm),
      };
      return map[printableStatusMachine] || map.default;
    })(printableStatus);

    const migrateOrCancelMigrationCompute =
      printableStatus === Migrating ||
      (vmim && ![vmimStatuses.Failed, vmimStatuses.Succeeded].includes(vmim?.status?.phase))
        ? VirtualMachineActionFactory.cancelMigrationCompute(vm, vmim, isSingleNodeCluster)
        : VirtualMachineActionFactory.migrateCompute(vm, isSingleNodeCluster);

    const migrateStorage = VirtualMachineActionFactory.migrateStorage(vm, createModal);

    const pauseOrUnpause =
      printableStatus === Paused
        ? VirtualMachineActionFactory.unpause(vm)
        : VirtualMachineActionFactory.pause(vm);

    return [
      startOrStop,
      VirtualMachineActionFactory.restart(vm),
      pauseOrUnpause,
      VirtualMachineActionFactory.clone(vm, createModal),
      VirtualMachineActionFactory.snapshot(vm, createModal),
      VirtualMachineActionFactory.migrationActions(migrateOrCancelMigrationCompute, migrateStorage),
      VirtualMachineActionFactory.copySSHCommand(vm, virtctlCommand),
      VirtualMachineActionFactory.moveToFolder(vm, createModal),
      VirtualMachineActionFactory.delete(vm, createModal),
    ];
  }, [vm, vmim, isSingleNodeCluster, createModal, virtctlCommand]);

  return useMemo(() => [actions, !inFlight, undefined], [actions, inFlight]);
};

export default useVirtualMachineActionsProvider;
