// import { testName } from '../../support';
import {VirtualMachineData} from '../../types/vm';
import {DiskSource} from '../../utils/const/diskSource';
import {K8S_KIND, TEST_NS, VM_STATUS} from '../../utils/const/index';
import {TEMPLATE} from '../../utils/const/template';
import * as catalogView from '../../views/catalog';
import {tab, tabs} from '../../views/tab';
import {guestToolDisk, row, vmNode} from '../../views/selector';
import {vm, waitForStatus} from '../../views/vm';

const defVM: VirtualMachineData = {
    name: `win-vm-from-default-wizard-${TEST_NS}`,
    namespace: TEST_NS,
    template: TEMPLATE.WIN2K19,
    // provisionSource: ProvisionSource.URL,
    diskSource: DiskSource.WIN2K19_URL,
    // pvcSize: '60',
    // sshEnable: false,
    startOnCreation: true,
    cdrom: false,
};

const noWGTVM: VirtualMachineData = {
    name: `no-wgt-win-vm-${TEST_NS}`,
    namespace: TEST_NS,
    template: TEMPLATE.WIN10,
    // provisionSource: ProvisionSource.WIN10_URL,
    diskSource: DiskSource.WIN10_URL,
    // sshEnable: false,
    startOnCreation: true,
    // umountGuestTool: true,
};

const cusVM: VirtualMachineData = {
    name: `win-vm-from-custom-wizard-${TEST_NS}`,
    namespace: TEST_NS,
    template: TEMPLATE.WIN10,
    // provisionSource: ProvisionSource.WIN10_URL,
    diskSource: DiskSource.WIN10_URL,
    // pvcSize: '60', // it's default
    // workload: Workload.Performance, // bz2020153
    // sshEnable: false,
    startOnCreation: true,
    cdrom: false,
};

const defISOVM: VirtualMachineData = {
    name: `win-iso-vm-from-default-wizard-${TEST_NS}`,
    namespace: TEST_NS,
    template: TEMPLATE.WIN2K19,
    // provisionSource: ProvisionSource.WIN2K19_ISO_URL,
    diskSource: DiskSource.WIN2K19_URL,
    // pvcSize: '60',
    // sshEnable: false,
    startOnCreation: true,
    cdrom: true,
};

const cusISOVM: VirtualMachineData = {
    name: `win-iso-vm-from-custom-wizard-${TEST_NS}`,
    namespace: TEST_NS,
    template: TEMPLATE.WIN10,
    // provisionSource: ProvisionSource.WIN2K19_ISO_URL,
    diskSource: DiskSource.DEFAULT,
    // pvcSize: '60',
    // workload: Workload.Performance, // bz2020153
    // sshEnable: false,
    startOnCreation: true,
    cdrom: true,
};

const veryWinGuestTools = (vmData: VirtualMachineData, expect: boolean) => {
    cy.byLegacyTestID(vmData.name)
        .should('exist')
        .click();
    tab.navigateToDisk();
    cy.get(guestToolDisk).should(expect ? 'exist' : 'not.exist');
};

const veryRootDiskSize = () => {
    cy.get(row)
        .contains('rootdisk')
        .within(() => {
            cy.get('div')
                .contains('GiB')
                .then(($div) => {
                    const gib = Number($div.text().split(' ')[0]);
                    expect(gib >= 60);
                });
        });
};

describe('Test windows VM creation', () => {
    before(() => {
        cy.login();
        // cy.newProject(TEST_NS);
        cy.selectProject(TEST_NS);
    });

    after(() => {
        cy.deleteResource(K8S_KIND.VM, defVM.name, TEST_NS);
        cy.deleteResource(K8S_KIND.VM, noWGTVM.name, TEST_NS);
        cy.deleteResource(K8S_KIND.VM, cusVM.name, TEST_NS);
        cy.deleteResource(K8S_KIND.VM, defISOVM.name, TEST_NS);
        cy.deleteResource(K8S_KIND.VM, cusISOVM.name, TEST_NS);
        cy.deleteResource(K8S_KIND.VM, defVM.name, TEST_NS);
    });

    describe(
        'create windows VM from source URL',
        {
            retries: {
                runMode: 0,
            },
        },
        () => {
            xit('ID(CNV-7494) Create windows VM via default wizard', () => {
                vm.create(defVM);
                // veryWinGuestTools(defVM, true);
                cy.loaded();
                cy.byLegacyTestID(defVM.name).should('be.visible');
            });

            it('ID(CNV-7495) Create windows VM via customize wizard', () => {
                vm.create(cusVM);
                // veryWinGuestTools(cusVM, true);
                cy.loaded();
                cy.byLegacyTestID(cusVM.name).should('be.visible');
            });

            it('ID(CNV-7301) Verify windows guest tool is not installed if uncheck it in template', () => {
                vm.create(noWGTVM);
                // veryWinGuestTools(noWGTVM, false);
                // regression test for bz2018985
                veryRootDiskSize();
                cy.loaded();
                cy.byLegacyTestID(noWGTVM.name).should('be.visible');
            });

            // skip below tests until bz2049762 is fixed for 4.10
            //
            xit('ID(CNV-7508) Windows VM with CDROM migration', () => {
                if (Cypress.env('STORAGE_CLASS') === 'ocs-storagecluster-ceph-rbd') {
                    tab.navigateToDetails();
                    cy.get(tabs.Details).then(($node) => {
                        const nodeName = $node.text();
                        // vm.migrate();
                        // waitForStatus(VM_STATUS.Migrating);
                        waitForStatus(VM_STATUS.Running);
                        cy.get(vmNode).should(($node1) => {
                            const nodeName1 = $node1.text();
                            expect(nodeName1).not.equal(nodeName);
                        });
                    });
                }
            });
        },
    );

    describe(
        'create windows VM from ISO',
        {
            retries: {
                runMode: 0,
            },
        },
        () => {
            it('ID(CNV-6799) Create windows VM from ISO via default wizard', () => {
                vm.create(defISOVM);
                // veryWinGuestTools(defISOVM, true);
                cy.loaded();
                cy.byLegacyTestID(defISOVM.name).should('be.visible');
            });

            it('ID(CNV-7493) Create windows VM from ISO via customize wizard', () => {
                vm.create(cusISOVM);
                // veryWinGuestTools(cusISOVM, true);
                cy.loaded();
                cy.byLegacyTestID(cusISOVM.name).should('be.visible');
            });
        },
    );
});
