import React from 'react';

import { useKubevirtTranslation } from '@kubevirt-utils/hooks/useKubevirtTranslation';
import { FileUpload } from '@patternfly/react-core';

import TabModal from '../TabModal/TabModal';

export const AuthorizedSSHKeyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  sshKey: string;
  onChange: (sshKey: string) => void | Promise<void>;
}> = ({ sshKey, onChange, onClose, isOpen }) => {
  const { t } = useKubevirtTranslation();
  const [value, setValue] = React.useState(sshKey);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const submitHandler = React.useCallback(async () => {
    onChange(value);
  }, [onChange, value]);

  return (
    <TabModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={submitHandler}
      headerText={t('Authorized SSH Key')}
    >
      <FileUpload
        id={'ssh-key-modal'}
        type="text"
        value={value}
        onChange={(v) => setValue(v as string)}
        onReadStarted={() => setIsLoading(true)}
        onReadFinished={() => setIsLoading(false)}
        isLoading={isLoading}
        allowEditingUploadedText
        isReadOnly={false}
      />
    </TabModal>
  );
};