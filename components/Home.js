import { useState, useEffect } from "react";
import { Popover, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Movie from "./Movie";
import "antd/dist/antd.css";
import styles from "../styles/Home.module.css";
const fetch = require("node-fetch");

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);
  const [movieApi, setMovieApi] = useState([]);

  // "overview": "Po  Warrior.",
  // "popularity": 1665.369,
  // "poster_path": "/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
  // "release_date": "2024-03-02",
  // "title": "Kung Fu Panda 4",
  // "video": false,
  // "vote_average": 7.155,
  // "vote_count": 1231

  useEffect(() => {
    fetch("https://mymoviz-backend-snowy-rho.vercel.app/movies")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.movies);

        setMovieApi(data.movies.results);
      });
  }, []);

  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find((movie) => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter((movie) => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon
          icon={faCircleXmark}
          onClick={() => updateLikedMovies(data)}
          className={styles.crossIcon}
        />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>{likedMoviesPopover}</div>
  );

  const movies = movieApi.map((data, i) => {
    const isLiked = likedMovies.some((movie) => movie === data.title);
    console.log(data);
    return (
      <Movie
        key={i}
        updateLikedMovies={updateLikedMovies}
        isLiked={isLiked}
        title={data.title}
        overview={data.overview.substring(0, 250) + "..."}
        poster={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
        voteAverage={data.vote_average}
        voteCount={data.vote_count}
      />
    );
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover
          title="Liked movies"
          content={popoverContent}
          className={styles.popover}
          trigger="click"
        >
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>{movies}</div>
    </div>
  );
}

export default Home;
