import { VirtualMachineModelRef } from '@kubevirt-ui/kubevirt-api/console';
import { V1VirtualMachine, V1VirtualMachineInstance } from '@kubevirt-ui/kubevirt-api/kubevirt';
import { isEqualObject } from '@kubevirt-utils/components/NodeSelectorModal/utils/helpers';
import {
  getDisks,
  getGPUDevices,
  getHostDevices,
  getInterfaces,
  getVolumes,
} from '@kubevirt-utils/resources/vm';
import { transformDevices } from '@kubevirt-utils/resources/vm/utils/boot-order/bootOrder';
import { isEmpty } from '@kubevirt-utils/utils/utils';

import { VirtualMachineDetailsTabLabel } from './constants';
import { PendingChange } from './types';

export const checkCPUMemoryChanged = (
  vm: V1VirtualMachine,
  vmi: V1VirtualMachineInstance,
): boolean => {
  if (isEmpty(vm) || isEmpty(vmi)) {
    return false;
  }
  const vmRequests = vm?.spec?.template?.spec?.domain?.resources?.requests || {};
  const vmCPU = vm?.spec?.template?.spec?.domain?.cpu?.cores || 0;

  const vmiRequests = vmi?.spec?.domain?.resources?.requests || {};
  const vmiCPU = vmi?.spec?.domain?.cpu?.cores || 0;

  return !isEqualObject(vmRequests, vmiRequests) || vmCPU !== vmiCPU;
};

export const checkBootOrderChanged = (
  vm: V1VirtualMachine,
  vmi: V1VirtualMachineInstance,
): boolean => {
  if (isEmpty(vm) || isEmpty(vmi)) {
    return false;
  }

  const vmDevices = transformDevices(getDisks(vm), getInterfaces(vm));
  const vmiDevices = transformDevices(
    vmi?.spec?.domain?.devices?.disks,
    vmi?.spec?.domain?.devices?.interfaces,
  );

  if (vmDevices?.length !== vmiDevices?.length) {
    return true;
  }
  const vmBootOrder = vmDevices?.sort((a, b) => a?.value?.bootOrder - b?.value?.bootOrder);
  // if boot order is not configured, we check if the disks order in the YAML has changed
  if (vmBootOrder?.length === 0) {
    return vmDevices?.some((device, index) => !isEqualObject(device, vmiDevices?.[index]));
  }

  const vmiBootOrder = vmiDevices?.sort((a, b) => a?.value?.bootOrder - b?.value?.bootOrder);

  return !vmBootOrder.every(
    (device, index) =>
      device.type === vmiBootOrder[index].type &&
      device.typeLabel === vmiBootOrder[index].typeLabel &&
      device.value.bootOrder === vmiBootOrder[index].value.bootOrder &&
      device.value.name === vmiBootOrder[index].value.name,
  );
};
export const getChangedEnvDisks = (
  vm: V1VirtualMachine,
  vmi: V1VirtualMachineInstance,
): string[] => {
  if (isEmpty(vm) || isEmpty(vmi)) {
    return [];
  }
  // to get env disks, we want to filter the volumes with configMap/ prop set
  const vmVolumes = getVolumes(vm)?.filter(
    (vol) => vol?.configMap || vol?.secret || vol?.serviceAccount,
  );
  const vmiVolumes = vmi?.spec?.volumes?.filter(
    (vol) => vol?.configMap || vol?.secret || vol?.serviceAccount,
  );

  const vmEnvDisksNames = vmVolumes?.map((vol) => vol?.name);
  const vmiEnvDisksNames = vmiVolumes?.map((vol) => vol?.name);
  // to get the changed disks, we want to intersect between the two name arrays
  // and get the disks that are NOT in the intersection
  const unchangedEnvDisks = vmEnvDisksNames?.filter((vmDiskName) =>
    vmiEnvDisksNames?.some((vmiDiskName) => vmDiskName === vmiDiskName),
  );
  const changedEnvDisks = [
    ...(vmEnvDisksNames?.filter((disk) => !unchangedEnvDisks?.includes(disk)) || []),
    ...(vmiEnvDisksNames?.filter((disk) => !unchangedEnvDisks?.includes(disk)) || []),
  ];
  return changedEnvDisks;
};

export const getChangedNics = (vm: V1VirtualMachine, vmi: V1VirtualMachineInstance): string[] => {
  if (isEmpty(vm) || isEmpty(vmi)) {
    return [];
  }
  const vmInterfaces = getInterfaces(vm);
  const vmiInterfaces = vmi?.spec?.domain?.devices?.interfaces;
  const vmNicsNames = vmInterfaces?.map((nic) => nic?.name);
  const vmiNicsNames = vmiInterfaces?.map((nic) => nic?.name);
  const unchangedNics = vmNicsNames?.filter((vmNicName) =>
    vmiNicsNames?.some((vmiNicName) => vmNicName === vmiNicName),
  );
  const changedNics = [
    ...(vmNicsNames?.filter((nic) => !unchangedNics?.includes(nic)) || []),
    ...(vmiNicsNames?.filter((nic) => !unchangedNics?.includes(nic)) || []),
  ];
  return changedNics;
};
export const getChangedGPUDevices = (
  vm: V1VirtualMachine,
  vmi: V1VirtualMachineInstance,
): string[] => {
  if (isEmpty(vm) || isEmpty(vmi)) {
    return [];
  }
  const vmGPUDevices = getGPUDevices(vm);
  const vmiGPUDevices = vmi?.spec?.domain?.devices?.gpus;
  const vmGPUDevicesNames = vmGPUDevices?.map((gpu) => gpu?.name);
  const vmiGPUDevicesNames = vmiGPUDevices?.map((gpu) => gpu?.name);
  const unchangedGPUDevices = vmGPUDevicesNames?.filter((vmGPUDeviceName) =>
    vmiGPUDevicesNames?.some((vmiGPUDeviceName) => vmGPUDeviceName === vmiGPUDeviceName),
  );
  const changedGPUDevices = [
    ...(vmGPUDevicesNames?.filter((gpu) => !unchangedGPUDevices?.includes(gpu)) || []),
    ...(vmiGPUDevicesNames?.filter((gpu) => !unchangedGPUDevices?.includes(gpu)) || []),
  ];
  return changedGPUDevices;
};
export const getChangedHostDevices = (
  vm: V1VirtualMachine,
  vmi: V1VirtualMachineInstance,
): string[] => {
  if (isEmpty(vm) || isEmpty(vmi)) {
    return [];
  }
  const vmHostDevices = getHostDevices(vm);
  const vmiHostDevices = vmi?.spec?.domain?.devices?.hostDevices;
  const vmHostDevicesNames = vmHostDevices?.map((hostDevice) => hostDevice?.name);
  const vmiHostDevicesNames = vmiHostDevices?.map((hostDevice) => hostDevice?.name);
  const unchangedHostDevices = vmHostDevicesNames?.filter((vmHostDeviceName) =>
    vmiHostDevicesNames?.some((vmiHostDeviceName) => vmHostDeviceName === vmiHostDeviceName),
  );
  const changedHostDevices = [
    ...(vmHostDevicesNames?.filter((hostDevice) => !unchangedHostDevices?.includes(hostDevice)) ||
      []),
    ...(vmiHostDevicesNames?.filter((hostDevice) => !unchangedHostDevices?.includes(hostDevice)) ||
      []),
  ];
  return changedHostDevices;
};

export const getTabURL = (vm: V1VirtualMachine, tab: string) =>
  `/k8s/ns/${vm?.metadata?.namespace}/${VirtualMachineModelRef}/${vm?.metadata?.name}/${tab}`;

export const getPendingChangesByTab = (pendingChanges: PendingChange[]) => {
  const pendingChangesDetailsTab = pendingChanges?.filter(
    (change) =>
      change?.tabLabel === VirtualMachineDetailsTabLabel.Details && change?.hasPendingChange,
  );
  const pendingChangesEnvTab = pendingChanges?.filter(
    (change) =>
      change?.tabLabel === VirtualMachineDetailsTabLabel.Environment && change?.hasPendingChange,
  );
  const pendingChangesNICsTab = pendingChanges?.filter(
    (change) =>
      change?.tabLabel === VirtualMachineDetailsTabLabel.NetworkInterfaces &&
      change?.hasPendingChange,
  );

  return {
    pendingChangesDetailsTab,
    pendingChangesEnvTab,
    pendingChangesNICsTab,
  };
};
