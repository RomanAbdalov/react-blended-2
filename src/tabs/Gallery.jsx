import { Component } from 'react';

import * as ImageService from 'service/image-service';
import { Button, SearchForm, Grid, GridItem, Text, CardItem } from 'components';

export class Gallery extends Component {
  state = {
    query: '',
    imgs: [],
    page: 1,
    isEmpty: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { query, page } = this.state;

    if (page !== prevState.page || query !== prevState.query) {
      try {
        const { photos, total_results } = await ImageService.getImages(
          query,
          page
        );
        if (!photos.length) {
          this.setState({ isEmpty: true });
          return;
        }
        this.setState(prevState => ({ imgs: [...prevState.imgs, ...photos] }));
      } catch (error) {}
    }
  }

  onSubmit = query => {
    this.setState({ query, page: 1, imgs: [], isEmpty: false });
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
        {this.state.isEmpty && (
          <Text textAlign="center">Sorry. There are no images ... 😭</Text>
        )}
      </>
    );
  }
}
