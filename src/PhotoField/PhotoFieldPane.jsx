import React from 'react';
import PropTypes from 'prop-types';
import PlusThin from 'salt-icon/lib/PlusThin';
import IconPhoto from 'salt-icon/lib/Photo';
import IconUpload from 'salt-icon/lib/Upload';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import Field from '../Field';
import { prefixClass } from '../Context';
import FoldablePane from '../FoldablePane';
import PhotoFieldItem from './PhotoFieldItem';
import PhotoFieldUploadItem from './PhotoFieldUploadItem';
import FileItem from './PhotoFieldFileItem';
import { getData } from './util';

class PhotoFieldPane extends React.Component {
  constructor(props) {
    super(props);
    this.foldHeight = 300;
  }

  componentDidMount() {
    const { type } = this.props;
    if (this.item && this.list) {
      if (type === 'photo') {
        this.foldHeight = (this.item.getDom().clientHeight * 2)
        + parseInt(this.splitLine.clientHeight, 10) + 1;
      } else if (type === 'file') {
        this.foldHeight = (this.item.getDom().clientHeight * 5)
        + parseInt(this.splitLine.clientHeight, 10) + 12;
      }

      this.forceUpdate();
    }
  }


  getUploadIcon() {
    if (this.uploadIcon) {
      /* eslint-disable react/no-find-dom-node */
      return ReactDOM.findDOMNode(this.uploadIcon);
      /* eslint-enable react/no-find-dom-node */
    }
    return null;
  }

  getListUploadIcon() {
    if (this.listUploadIcon) {
      return this.listUploadIcon;
    }
    return null;
  }

  isUploadDisabled() {
    const t = this;
    return t.props.maxUpload
      && (t.props.photoList.length + t.props.filesLengthInCore) >= t.props.maxUpload;
  }

  renderUploadIcon() {
    const t = this;
    if (t.props.type !== 'photo') {
      return null;
    }
    const itemWidth = `${100 / t.props.columns}%`;
    const style = { width: itemWidth, paddingTop: itemWidth, paddingBottom: '4px' };
    if (t.isUploadDisabled() || t.props.readOnly) {
      style.display = 'none';
    }
    return (
      <div
        className={prefixClass('PR FL photo-item')}
        style={style}
        onClick={() => { t.props.onPickerClick(); }}
        ref={(c) => { this.listUploadIcon = c; }}
      >
        <div className={prefixClass('photo-upload-icon-item')}>
          <div className={prefixClass('photo-list-upload-icon')}>
            <PlusThin />
          </div>
        </div>
      </div>
    );
  }

  renderPhotoList() {
    const t = this;
    const itemWidth = `calc((100vw - 20px) / ${t.props.columns})`;
    const photoItem = t.props.photoList.map((item, index) => {
      const props = {
        index,
        url: item.url || getData(item.response).url,
        name: item.name,
        width: itemWidth,
        key: index,
        columns: t.props.columns,
        readOnly: t.props.readOnly,
        ref: (c) => { if (index === 0) { this.item = c; } },
        onDeleteImage: (i) => { t.props.onImageDelete(i); },
        onPreviewImage: (i) => { t.props.onImagePreview(i); },
      };
      return (
        t.props.type === 'photo' ? <PhotoFieldItem {...props} /> : <FileItem {...props} />
      );
    });
    const isItemDisabled =
      parseInt(t.props.photoList.length, 10) >= parseInt(t.props.maxUpload, 10);
    const files = t.props.files
      .map((file, index) => {
        const props = {
          file,
          width: itemWidth,
          key: index,
          locale: t.props.locale,
          disabled: isItemDisabled,
        };
        return (
          t.props.type === 'photo' ? <PhotoFieldUploadItem {...props} /> : <FileItem {...props} />
        );
      });
    const shouldHide = photoItem.length === 0 && files.length === 0;
    if (shouldHide) return null;
    const list = (
      <div
        className={classnames(prefixClass('photo-list'), {
          [prefixClass('photo-file-list')]: t.props.type === 'file',
        })}
        ref={(c) => { this.list = c; }}
      >
        <div className={prefixClass('photo-list-split-line')} ref={(c) => { this.splitLine = c; }} />
        {t.props.type === 'photo' ? photoItem.reverse() : photoItem}
        {files}
        {this.renderUploadIcon()}
      </div>
    );
    if (t.props.readOnly) {
      return (
        <FoldablePane isFold foldHeight={this.foldHeight}>
          {list}
        </FoldablePane>
      );
    }
    return list;
  }

  renderPlaceholder() {
    const t = this;
    if (t.props.maxUpload) {
      return (
        <div
          className={
            classnames(prefixClass('omit photo-field-placeholder'), {
              [prefixClass('hide')]: t.props.readOnly,
            })}
        >
          {t.props.placeholder}
          {` ${t.props.photoList.length}/${t.props.maxUpload}`}
        </div>
      );
    }
    return null;
  }


  render() {
    const t = this;
    const IconType = t.props.type === 'photo' ? IconPhoto : IconUpload;
    return (
      <div
        className={classnames(prefixClass('photo-field'), {
          [t.props.className]: !!t.props.className,
          [prefixClass('hide')]: t.props.hide,
          readOnly: t.props.readOnly,
        })}
      >
        <Field
          required={t.props.required}
          label={t.props.label}
          tip={t.props.tip}
          errMsg={t.props.errMsg}
          layout={t.props.layout}
          readOnly={t.props.readOnly}
          labelRight={
            <div className={classnames(prefixClass('photo-field-label-right'))}>
              {t.renderPlaceholder()}
              {!t.props.readOnly
                ? <IconType
                  onClick={() => { if (!t.isUploadDisabled()) { t.props.onPickerClick(); } }}
                  className={classnames(prefixClass('photo-upload-icon'), {
                    [prefixClass('photo-upload-icon__disabled')]: t.isUploadDisabled(),
                  })}
                  ref={(c) => { this.uploadIcon = c; }}
                  fill={t.props.fill}
                  width={24}
                  height={24}
                />
                : null}
            </div>
          }
        >
          {this.renderPhotoList()}
        </Field>
      </div>
    );
  }
}


PhotoFieldPane.defaultProps = {
  photoList: [],
  files: [],
  onPickerClick: () => { },
  onImageDelete: () => { },
  onImagePreview: () => { },
  columns: undefined,
  placeholder: undefined,
  label: undefined,
  readOnly: undefined,
  required: undefined,
  layout: 'v',
  type: 'photo',
};
// http://facebook.github.io/react/docs/reusable-components.html
PhotoFieldPane.propTypes = {
  columns: PropTypes.number,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  photoList: PropTypes.array,
  files: PropTypes.array,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  onPickerClick: PropTypes.func,
  onImageDelete: PropTypes.func,
  onImagePreview: PropTypes.func,
  layout: PropTypes.string,
  type: PropTypes.string,
};

export default PhotoFieldPane;
