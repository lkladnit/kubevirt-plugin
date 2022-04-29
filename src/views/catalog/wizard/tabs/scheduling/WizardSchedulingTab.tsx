import * as React from 'react';

import { WizardTab } from '@catalog/wizard/tabs';
import { modelToGroupVersionKind, NodeModel } from '@kubevirt-ui/kubevirt-api/console';
import { IoK8sApiCoreV1Node } from '@kubevirt-ui/kubevirt-api/kubernetes';
import AffinityModal from '@kubevirt-utils/components/AffinityModal/AffinityModal';
import DedicatedResourcesModal from '@kubevirt-utils/components/DedicatedResourcesModal/DedicatedResourcesModal';
import DeschedulerModal from '@kubevirt-utils/components/DeschedulerModal/DeschedulerModal';
import EvictionStrategyModal from '@kubevirt-utils/components/EvictionStrategyModal/EvictionStrategyModal';
import { useModal } from '@kubevirt-utils/components/ModalProvider/ModalProvider';
import NodeSelectorModal from '@kubevirt-utils/components/NodeSelectorModal/NodeSelectorModal';
import TolerationsModal from '@kubevirt-utils/components/TolerationsModal/TolerationsModal';
import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { DescriptionList, Grid, GridItem, Title } from '@patternfly/react-core';

import { WizardDescriptionItem } from '../../components/WizardDescriptionItem';

import Affinity from './components/Affinity';
import DedicatedResources from './components/DedicatedResources';
import Descheduler from './components/Descheduler';
import EvictionStrategy from './components/EvictionStrategy';
import NodeSelector from './components/NodeSelector';
import Tolerations from './components/Tolerations';

const WizardSchedulingTab: WizardTab = ({ vm, updateVM }) => {
  const { t } = useKubevirtTranslation();
  const { createModal } = useModal();

  const [nodes, nodesLoaded] = useK8sWatchResource<IoK8sApiCoreV1Node[]>({
    groupVersionKind: modelToGroupVersionKind(NodeModel),
    isList: true,
  });

  return (
    <div className="co-m-pane__body">
      <Title headingLevel="h2" className="co-section-heading">
        {t('Scheduling and resources requirements')}
      </Title>
      <Grid hasGutter>
        <GridItem span={6} rowSpan={4}>
          <DescriptionList>
            <WizardDescriptionItem
              title={t('Node Selector')}
              description={<NodeSelector vm={vm} />}
              isEdit
              onEditClick={() =>
                createModal(({ isOpen, onClose }) => (
                  <NodeSelectorModal
                    vm={vm}
                    isOpen={isOpen}
                    onClose={onClose}
                    onSubmit={updateVM}
                  />
                ))
              }
            />

            <WizardDescriptionItem
              description={<Tolerations vm={vm} />}
              title={t('Tolerations')}
              isEdit
              onEditClick={() =>
                createModal(({ isOpen, onClose }) => (
                  <TolerationsModal vm={vm} isOpen={isOpen} onClose={onClose} onSubmit={updateVM} />
                ))
              }
            />

            <WizardDescriptionItem
              title={t('Affinity Rules')}
              description={<Affinity vm={vm} />}
              isEdit
              onEditClick={() =>
                createModal(({ isOpen, onClose }) => (
                  <AffinityModal
                    vm={vm}
                    isOpen={isOpen}
                    onClose={onClose}
                    onSubmit={updateVM}
                    nodes={nodes}
                    nodesLoaded={nodesLoaded}
                  />
                ))
              }
            />

            <WizardDescriptionItem
              title={t('Descheduler')}
              description={<Descheduler vm={vm} />}
              isEdit
              onEditClick={() =>
                createModal(({ isOpen, onClose }) => (
                  <DeschedulerModal vm={vm} isOpen={isOpen} onClose={onClose} onSubmit={updateVM} />
                ))
              }
            />
          </DescriptionList>
        </GridItem>

        <GridItem span={6} rowSpan={4}>
          <DescriptionList>
            <WizardDescriptionItem
              title={t('Dedicated Resources')}
              description={<DedicatedResources vm={vm} />}
              isEdit
              onEditClick={() =>
                createModal(({ isOpen, onClose }) => (
                  <DedicatedResourcesModal
                    vm={vm}
                    isOpen={isOpen}
                    onClose={onClose}
                    onSubmit={updateVM}
                    headerText={t('Dedicated Resources')}
                  />
                ))
              }
            />

            <WizardDescriptionItem
              title={t('Eviction Strategy')}
              description={<EvictionStrategy vm={vm} />}
              isEdit
              onEditClick={() =>
                createModal(({ isOpen, onClose }) => (
                  <EvictionStrategyModal
                    vm={vm}
                    isOpen={isOpen}
                    onClose={onClose}
                    onSubmit={updateVM}
                    headerText={t('Eviction Strategy')}
                  />
                ))
              }
            />
          </DescriptionList>
        </GridItem>
      </Grid>
    </div>
  );
};

export default WizardSchedulingTab;
