import React, { Component } from 'react';
import './main.css';
import Movie from './components/Movie.jsx';
import Header from './components/Header.jsx';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      moviesList: [],
      favoriteMovies: [],
      noResults: false
    };
  }

  getMovieData = movieKeyword => {
    const apiKey = "d81936073c4521279f82d66f90883d37";

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${movieKeyword}&total_pages=1`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((movies) => {
        if (movies.results.length === 0) {
          this.setState({ noResults: true })
        }
        this.updateMoviesList(movies);
      })
      .catch(error => {
        console.log(error.message);
      })
  };

  updateMoviesList = movies => {
    const newMoviesList = [];

    movies.results.forEach(movie => {
      newMoviesList.push({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster: `https://image.tmdb.org/t/p/w500//${movie.poster_path}`,
        rating: movie.vote_average,
        liked: '',
      });
    });

    this.setState({ moviesList: newMoviesList });
  }

  likeMovie = movie => {
    this.setState((prevState) => {
      if (prevState.favoriteMovies.indexOf(movie.id) > -1) {
        return {
          favoriteMovies: prevState.favoriteMovies.filter(movieId => 
            (movieId !== movie.id)
          ),
        };
      } else {
        return { 
          favoriteMovies: [...prevState.favoriteMovies, movie.id]
        };
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <header className="header">
          <a href="/">
            <img
              src="https://fontmeme.com/permalink/190707/fd4735271a0d997cbe19a04408c896fc.png"
              alt="netflix-font"
              border="0"
            />
          </a>
          <Header inputMovie={this.getMovieData} />
        </header>
        <div className="titleList">
          <div className="title">
          {this.state.moviesList.length > 0 && <h1>Movies</h1>}
            <div className="titles-wrapper">
              { 
              this.state.moviesList.map((movie) => (
                <Movie
                  key = {movie.id}
                  movie = {movie}
                  favoriteMovies = {this.state.favoriteMovies} 
                  onClick={() => this.likeMovie(movie)}
                />
                ))              
              }
            </div>
            {
              this.state.noResults && <div className='no-results'>Sorry, no results were found...</div>
            }
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
