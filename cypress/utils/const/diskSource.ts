export const DiskSource = {
  DEFAULT: {
    name: 'Default',
    selectorID: 'default',
  },
  URL: {
    name: 'URL',
    selectorID: 'http',
    value: 'https://download.cirros-cloud.net/0.5.2/cirros-0.5.2-x86_64-disk.img',
  },
  WIN10_URL: {
    name: 'URL',
    selectorID: 'http',
    value: 'http://cnv-qe-server.rhevdev.lab.eng.rdu2.redhat.com/files/cnv-tests/windows-images/win_10.qcow2',
  },
  WIN2K19_URL: {
    name: 'URL',
    selectorID: 'http',
    value: 'http://cnv-qe-server.rhevdev.lab.eng.rdu2.redhat.com/files/cnv-tests/windows-images/iso/win_19.iso',
  },
  PVC: {
    name: 'PVC',
    selectorID: 'pvc',
    pvcName: '',
    pvcNS: '',
  },
  REGISTRY: {
    name: 'Registry',
    selectorID: 'registry',
    value: 'quay.io/kubevirt/fedora-with-test-tooling-container-disk:latest',
  },
};
