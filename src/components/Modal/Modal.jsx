import React from 'react';
import { Overlay, ModalImage } from './Modal.styled';

export class Modal extends React.Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleClick);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleClick);
  }

  handleClick = e => {
    if (e.code === 'Escape') this.props.onClose();
  };

  onOverlayClickClose = e => {
    if (e.currentTarget === e.target) {
      this.props.onClose();
    }
  };

  render() {
    const { src, alt } = this.props.image;
    return (
      <Overlay onClick={this.onOverlayClickClose}>
        <ModalImage>
          <img src={src.large} alt={alt} />
        </ModalImage>
      </Overlay>
    );
  }
}
