import * as React from 'react';
import Animate from 'rc-animate';
import classNames from 'classnames';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import Tooltip from '../../tooltip';
import Progress from '../../progress';
import {
  ItemRender,
  UploadFile,
  UploadListProgressProps,
  UploadListType,
  UploadLocale,
} from '../interface';

export interface ListItemProps {
  prefixCls: string;
  locale: UploadLocale;
  file: UploadFile;
  listType?: UploadListType;
  isImgUrl?: (file: UploadFile) => boolean;
  showRemoveIcon?: boolean;
  showDownloadIcon?: boolean;
  showPreviewIcon?: boolean;
  removeIcon?: React.ReactNode | ((file: UploadFile) => React.ReactNode);
  downloadIcon?: React.ReactNode | ((file: UploadFile) => React.ReactNode);
  iconRender: (file: UploadFile) => React.ReactNode;
  actionIconRender: (
    customIcon: React.ReactNode,
    callback: () => void,
    prefixCls: string,
    title?: string | undefined,
  ) => React.ReactNode;
  itemRender?: ItemRender;
  onPreview: (file: UploadFile, e: React.SyntheticEvent<HTMLElement>) => void;
  onClose: (file: UploadFile) => void;
  onDownload: (file: UploadFile) => void;
  progress?: UploadListProgressProps;
}

function ListItem({
  prefixCls,
  locale,
  listType,
  file,
  progress: progressProps,
  iconRender,
  actionIconRender,
  itemRender,
  isImgUrl,
  showPreviewIcon,
  showRemoveIcon,
  showDownloadIcon,
  removeIcon: customRemoveIcon,
  downloadIcon: customDownloadIcon,
  onPreview,
  onDownload,
  onClose,
}: ListItemProps) {
  let progress;
  const iconNode = iconRender(file);
  let icon = <div className={`${prefixCls}-text-icon`}>{iconNode}</div>;
  if (listType === 'picture' || listType === 'picture-card') {
    if (file.status === 'uploading' || (!file.thumbUrl && !file.url)) {
      const uploadingClassName = classNames({
        [`${prefixCls}-list-item-thumbnail`]: true,
        [`${prefixCls}-list-item-file`]: file.status !== 'uploading',
      });
      icon = <div className={uploadingClassName}>{iconNode}</div>;
    } else {
      const thumbnail = isImgUrl?.(file) ? (
        <img
          src={file.thumbUrl || file.url}
          alt={file.name}
          className={`${prefixCls}-list-item-image`}
        />
      ) : (
        iconNode
      );
      const aClassName = classNames({
        [`${prefixCls}-list-item-thumbnail`]: true,
        [`${prefixCls}-list-item-file`]: isImgUrl && !isImgUrl(file),
      });
      icon = (
        <a
          className={aClassName}
          onClick={e => onPreview(file, e)}
          href={file.url || file.thumbUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {thumbnail}
        </a>
      );
    }
  }

  if (file.status === 'uploading') {
    // show loading icon if upload progress listener is disabled
    const loadingProgress =
      'percent' in file ? <Progress {...progressProps} type="line" percent={file.percent} /> : null;

    progress = (
      <div className={`${prefixCls}-list-item-progress`} key="progress">
        {loadingProgress}
      </div>
    );
  }
  const infoUploadingClass = classNames({
    [`${prefixCls}-list-item`]: true,
    [`${prefixCls}-list-item-${file.status}`]: true,
    [`${prefixCls}-list-item-list-type-${listType}`]: true,
  });
  const linkProps =
    typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;

  const removeIcon = showRemoveIcon
    ? actionIconRender(
        (typeof customRemoveIcon === 'function' ? customRemoveIcon(file) : customRemoveIcon) || (
          <DeleteOutlined />
        ),
        () => onClose(file),
        prefixCls,
        locale.removeFile,
      )
    : null;

  const downloadIcon =
    showDownloadIcon && file.status === 'done'
      ? actionIconRender(
          (typeof customDownloadIcon === 'function'
            ? customDownloadIcon(file)
            : customDownloadIcon) || <DownloadOutlined />,
          () => onDownload(file),
          prefixCls,
          locale.downloadFile,
        )
      : null;
  const downloadOrDelete = listType !== 'picture-card' && (
    <span
      key="download-delete"
      className={`${prefixCls}-list-item-card-actions ${listType === 'picture' ? 'picture' : ''}`}
    >
      {downloadIcon}
      {removeIcon}
    </span>
  );
  const listItemNameClass = classNames({
    [`${prefixCls}-list-item-name`]: true,
    [`${prefixCls}-list-item-name-icon-count-${
      [downloadIcon, removeIcon].filter(x => x).length
    }`]: true,
  });
  const preview = file.url
    ? [
        <a
          key="view"
          target="_blank"
          rel="noopener noreferrer"
          className={listItemNameClass}
          title={file.name}
          {...linkProps}
          href={file.url}
          onClick={e => onPreview(file, e)}
        >
          {file.name}
        </a>,
        downloadOrDelete,
      ]
    : [
        <span
          key="view"
          className={listItemNameClass}
          onClick={e => onPreview(file, e)}
          title={file.name}
        >
          {file.name}
        </span>,
        downloadOrDelete,
      ];
  const style: React.CSSProperties = {
    pointerEvents: 'none',
    opacity: 0.5,
  };
  const previewIcon = showPreviewIcon ? (
    <a
      href={file.url || file.thumbUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={file.url || file.thumbUrl ? undefined : style}
      onClick={e => onPreview(file, e)}
      title={locale.previewFile}
    >
      <EyeOutlined />
    </a>
  ) : null;

  const actions = listType === 'picture-card' && file.status !== 'uploading' && (
    <span className={`${prefixCls}-list-item-actions`}>
      {previewIcon}
      {file.status === 'done' && downloadIcon}
      {removeIcon}
    </span>
  );

  let message;
  if (file.response && typeof file.response === 'string') {
    message = file.response;
  } else {
    message = (file.error && file.error.statusText) || locale.uploadError;
  }
  const iconAndPreview = (
    <span>
      {icon}
      {preview}
    </span>
  );
  const dom = (
    <div className={infoUploadingClass}>
      <div className={`${prefixCls}-list-item-info`}>{iconAndPreview}</div>
      {actions}
      <Animate transitionName="fade" component="">
        {progress}
      </Animate>
    </div>
  );
  const listContainerNameClass = classNames({
    [`${prefixCls}-list-picture-card-container`]: listType === 'picture-card',
  });
  const item =
    file.status === 'error' ? (
      <Tooltip title={message} getPopupContainer={node => node.parentNode as HTMLElement}>
        {dom}
      </Tooltip>
    ) : (
      <span>{dom}</span>
    );
  return (
    <div className={listContainerNameClass}>
      {itemRender ? itemRender(item, file, items) : item}
    </div>
  );
}

export default ListItem;
