import {
  V1alpha1PersistentVolumeClaim,
  V1Disk,
  V1Volume,
} from '@kubevirt-ui/kubevirt-api/kubevirt';
import { RowFilter } from '@openshift-console/dynamic-plugin-sdk';

export type DiskRawData = {
  disk: V1Disk;
  volume: V1Volume;
  pvc?: V1alpha1PersistentVolumeClaim;
};

export type DiskRowDataLayout = {
  name: string;
  source: string;
  size: string;
  drive: string;
  interface: string;
  storageClass: string;
};

export const diskTypes = {
  disk: 'Disk',
  cdrom: 'CD-ROM',
  floppy: 'Floppy',
  lun: 'LUN',
};

export const filters: RowFilter[] = [
  {
    filterGroupName: 'Disk Type',
    type: 'disk-type',
    reducer: (obj) => obj?.drive,
    filter: (drives, obj) => {
      const drive = obj?.drive;
      return (
        drives.selected?.length === 0 ||
        drives.selected?.includes(drive) ||
        !drives?.all?.find((d) => d === drive)
      );
    },
    items: Object.keys(diskTypes).map((type) => ({
      id: type,
      title: diskTypes[type],
    })),
  },
];

export const getDiskDrive = (disk: V1Disk): string => {
  const type = Object.keys(diskTypes).find((driveType: string) =>
    Object.keys(disk).includes(driveType),
  );
  return type || 'disk';
};

export const getPrintableDiskDrive = (disk: V1Disk): string => diskTypes[getDiskDrive(disk)];

export const getDiskInterface = (disk: V1Disk): string => disk[getDiskDrive(disk)].bus;

export const getPrintableDiskInterface = (disk: V1Disk): string => {
  const diskInterface = getDiskInterface(disk);
  return diskInterface === 'virtio'
    ? diskInterface
    : diskInterface === 'scsi' || diskInterface === 'sata'
    ? diskInterface.toUpperCase()
    : '';
};

export const formatBytes = (rawSize: number, unit?: string): string => {
  const sizeUnits = ['B', 'KiB', 'MiB', 'GiB', 'TiB'];
  let unitIndex = (unit && sizeUnits.findIndex((sizeUnit) => sizeUnit === unit)) || 0;
  let convertedSize = rawSize;
  while (convertedSize >= 1024) {
    convertedSize = convertedSize / 1024;
    ++unitIndex;
  }

  const formattedSize = convertedSize.toFixed(2).concat(' ', sizeUnits[unitIndex]);
  return formattedSize;
};

export const getDiskRowDataLayout = (disks: DiskRawData[]): DiskRowDataLayout[] => {
  return disks?.map((device) => {
    const source = device?.pvc
      ? device?.pvc?.metadata?.name
      : device?.volume?.containerDisk
      ? 'Container (Ephemeral)'
      : 'Other';

    const size = device?.pvc
      ? formatBytes(Number(device?.pvc?.spec?.resources?.requests?.storage))
      : device?.volume?.containerDisk
      ? 'Dynamic'
      : '-';

    const storageClass = device?.pvc?.spec?.storageClassName || '-';

    return {
      name: device?.disk?.name,
      source,
      size,
      storageClass,
      interface: getPrintableDiskInterface(device?.disk),
      drive: getPrintableDiskDrive(device?.disk),
    };
  });
};
