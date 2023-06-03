import { Overlay } from './Loader.styled';
import { ColorRing } from 'react-loader-spinner';
export const Loader = () => {
  return (
    <Overlay>
      <ColorRing />
    </Overlay>
  );
};
