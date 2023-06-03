import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';
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
  };

  async componentDidUpdate(prevProps, prevState) {
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

  render() {
    return (
      <>
        <SearchForm onSubmit={this.onSubmit} />
        <Grid>
          {this.state.imgs.map(({ id, src, avg_color, alt }) => (
            <GridItem key={id}>
              <CardItem color={avg_color}>
                <img src={src.large} alt={alt} />
              </CardItem>
            </GridItem>
          ))}
        </Grid>
        {this.state.isLoading && <Loader />}
        {this.state.showBtn && <Button onClick={this.handleLoadMore}>Load more</Button>}
        {this.state.isEmpty && <Text textAlign="center">Sorry. There are no images ... 😭</Text>}
        {this.state.error && <Text textAlign="center">Sorry. {this.state.error} ... 😭</Text>}
      </>
    );
  }
}
