import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import SearchBox from "./SerachBox";
import ResultsNumber from "./ResultsNumber";
import Box from "./Ui/Box";
import Loader from "./Ui/Loader";
import ErrorMessage from "./Ui/ErrorMessage";
import ResultsList from "./ResultsList";
import WatchedSummary from "./WatchedSummary";
import UserMoviesList from "./UserMoviesList";
import MovieDetails from "./MovieDetails";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movieIdSelected, setMovieIdSelected] =
    useState(null);

  // select movie for watch movie list
  const selectMovieHandler = (id) => {
    setMovieIdSelected((mid) => (mid === id ? null : id));
  };

  // close movie details to back to watched movie list
  const closeMovieHandler = () => {
    setMovieIdSelected(null);
  };

  // add movie to the watched lsit movie
  const addWatchedHandler = (movieWatched) => {
    setWatched(
      (watched) => (watched = [...watched, movieWatched])
    );

    // close movie details to back to watched movie list
    closeMovieHandler();
  };

  // delete a watched movie from watched movie list
  const removeWatchedHandler = (id) => {
    setWatched(
      watched.filter((movie) => movie.imdbID !== id)
    );
  };

  useEffect(() => {
    const controller = new AbortController();
    // here we get data from api for movie list
    const getMovies = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch(
          `http://www.omdbapi.com/?apikey=a862ad48&s=${query}`,
          { signal: controller.signal }
        );

        if (!response.ok)
          throw new Error(
            "Something went wrong with fetching movies"
          );

        const data = await response.json();

        if (data.Response === "False")
          throw new Error("Movie not found!");

        setMovies(data.Search);
        setError("");
      } catch (error) {
        if (error.name !== "AbortError")
          setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    closeMovieHandler();
    getMovies();

    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <>
      <NavBar>
        <SearchBox query={query} setQuery={setQuery} />
        <ResultsNumber movies={movies} />
      </NavBar>
      <main className='main'>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <ResultsList
              movies={movies}
              onSelectMovie={selectMovieHandler}
            />
          )}
          {error && <ErrorMessage errorMessage={error} />}
        </Box>
        <Box>
          {movieIdSelected ? (
            <MovieDetails
              movieIdSelected={movieIdSelected}
              onCloseMovie={closeMovieHandler}
              onAddwatched={addWatchedHandler}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <UserMoviesList
                watched={watched}
                onRemoveWatched={removeWatchedHandler}
              />
            </>
          )}
        </Box>
      </main>
    </>
  );
}
