import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Ui/Loader";

const MovieDetails = ({
  movieIdSelected,
  onCloseMovie,
  onAddwatched,
  watched,
}) => {
  const [movie, setMovie] = useState({});
  const [isLosding, setIsLoading] = useState(false);
  const [movieRating, setMovieRating] = useState(0);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const getMovie = async () => {
    setIsLoading(true);
    const response = await fetch(
      `http://www.omdbapi.com/?apikey=a862ad48&i=${movieIdSelected}`
    );
    const data = await response.json();
    setMovie(data);
    setIsLoading(false);
  };

  useEffect(() => {
    const keyDownListener = (e) => {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    };

    document.addEventListener("keydown", keyDownListener);

    return () => {
      document.removeEventListener(
        "keydown",
        keyDownListener
      );
    };
  }, [onCloseMovie]);

  useEffect(() => {
    getMovie();
  }, [movieIdSelected]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  const newWatched = {
    imdbID: movieIdSelected,
    title,
    year,
    poster,
    imdbRating: +imdbRating,
    runtime: runtime && Number(runtime.split(" ").at(0)),
    userRating: +movieRating,
  };

  const isExist = watched
    .map((movie) => movie.imdbID)
    .includes(movieIdSelected);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === movieIdSelected
  )?.userRating;

  return (
    <div className='details'>
      {isLosding ? (
        <Loader />
      ) : (
        <>
          <header>
            <button
              className='btn-back'
              onClick={onCloseMovie}
            >
              &larr;
            </button>
            <img
              src={poster}
              alt={`Poster of ${title} movie`}
            />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>

          <section>
            <div className='rating'>
              {!isExist ? (
                <>
                  <StarRating
                    size={24}
                    maxRating={10}
                    onSetRating={setMovieRating}
                  />
                  {movieRating > 0 && (
                    <button
                      className='btn-add'
                      onClick={() =>
                        onAddwatched(newWatched)
                      }
                    >
                      + Add movie to list
                    </button>
                  )}{" "}
                </>
              ) : (
                <p>
                  You have already rated this movie{" "}
                  <span>{watchedUserRating}⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
