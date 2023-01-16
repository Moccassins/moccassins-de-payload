import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoadingOverlay } from '../../utilities/LoadingOverlay';

import './index.scss';

export const Loading: React.FC = () => {
  const baseClass = 'loading';
  const { t } = useTranslation('general');

  return (
    <div className={baseClass}>
      <span className={`${baseClass}__text`}>
        {t('loading')}
        ...
      </span>
    </div>
  );
};

const baseClass = 'fullscreen-loader';

type Props = {
  show?: boolean;
  loadingText?: string;
  overlayType?: string
}
export const FullscreenLoader: React.FC<Props> = ({ loadingText, show = true, overlayType }) => {
  const { t } = useTranslation('general');

  return (
    <div
      className={[
        baseClass,
        show ? `${baseClass}--entering` : `${baseClass}--exiting`,
        overlayType ? `${baseClass}--${overlayType}` : '',
      ].filter(Boolean).join(' ')}
    >
      <div className={`${baseClass}__bars`}>
        <div className={`${baseClass}__bar`} />
        <div className={`${baseClass}__bar`} />
        <div className={`${baseClass}__bar`} />
        <div className={`${baseClass}__bar`} />
        <div className={`${baseClass}__bar`} />
      </div>

      <span className={`${baseClass}__text`}>{loadingText || t('loading')}</span>
    </div>
  );
};

export const SuspenseLoader: React.FC = () => {
  const { toggleLoadingOverlay } = useLoadingOverlay();

  React.useEffect(() => {
    toggleLoadingOverlay({
      key: 'suspense',
      isLoading: true,
    });

    return () => {
      toggleLoadingOverlay({
        key: 'suspense',
        isLoading: false,
      });
    };
  }, [toggleLoadingOverlay]);

  return null;
};
