import React, { useState, useEffect } from 'react'
import './Row.css';
import { instance } from '../configs/axios';
import Youtube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const baseURL = "https://image.tmdb.org/t/p/original/";


function Row({ title, fetchURL, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() => {
        async function fetchPosts() {
            const response = await instance.get(fetchURL);
            setMovies(response.data.results);
            return response;
        }
        fetchPosts();
    }, [fetchURL])

    const opts = {
        height: "390",
        width: "100%",
        playerVars: { autoplay: 1 }
    }

    const handleClick = movie => {
        if (trailerUrl) {
            setTrailerUrl("");
        } else {
            movieTrailer(movie?.name || "")
                .then(url => {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get("v"));
                })
                .catch(error => console.log(error));
        }
    }

    return (
        <div className="row">
            <h2>{title} </h2>
            <div className="row__posters">
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                        src={`${baseURL}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                        alt={movie.name} onClick={() => handleClick(movie)} />
                ))}
            </div>
            { trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row
