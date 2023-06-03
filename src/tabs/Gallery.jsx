import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem, Modal } from 'components';
import { Loader } from 'components/Loader/Loader';

export class Gallery extends Component {
  state = {
    query: '',
    imgs: [],
    page: 1,
    isEmpty: false,
    showBtn: false,
    error: null,
    isLoading: false,
    showModal: false,
    modalImage: {},
  };

  async componentDidUpdate(_, prevState) {
    const { query, page } = this.state;

    if (page !== prevState.page || query !== prevState.query) {
      this.setState({ isLoading: true });
      try {
        const { photos, total_results } = await ImageService.getImages(query, page);
        if (!photos.length) {
          this.setState({ isEmpty: true });
          return;
        }
        this.setState(prevState => ({
          imgs: [...prevState.imgs, ...photos],
          showBtn: page < Math.ceil(total_results / 15),
        }));
      } catch (error) {
        this.setState({ error: error.message });
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  onSubmit = query => {
    this.setState({ query, page: 1, imgs: [], isEmpty: false, error: null });
  };

  handleLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  handleOpenModal = image => {
    const modalImage = { src: image.src, alt: image.alt };
    this.setState({ modalImage, showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { imgs, isLoading, showBtn, isEmpty, error, showModal, modalImage } = this.state;
    return (
      <>
        <SearchForm onSubmit={this.onSubmit} />
        <Grid>
          {imgs.map(({ id, src, avg_color, alt }) => (
            <GridItem onClick={() => this.handleOpenModal({ src, alt })} key={id}>
              <CardItem color={avg_color}>
                <img src={src.large} alt={alt} />
              </CardItem>
            </GridItem>
          ))}
        </Grid>
        {isLoading && <Loader />}
        {showBtn && <Button onClick={this.handleLoadMore}>Load more</Button>}
        {showModal && <Modal image={modalImage} onClose={this.handleCloseModal} />}
        {isEmpty && <Text textAlign="center">Sorry. There are no images ... 😭</Text>}
        {error && <Text textAlign="center">Sorry. {this.state.error} ... 😭</Text>}
      </>
    );
  }
}
