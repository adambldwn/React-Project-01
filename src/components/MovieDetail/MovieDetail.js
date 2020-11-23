import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ModalVideo from 'react-modal-video';
import Modal from 'react-modal';
import { auth, db } from '../../firebase/fbconfig';
import { MovieInput } from './MovieInput.style';
import { Card } from '../Card';
import { StyledMoviesWrapper } from '../CardList/CardList.style';



const apiKey = "2ab876e9698659187d8d9420ef4d232c"
const baseUrl = "https://api.themoviedb.org/3/search/movie";
const favArray = []
export const MovieDetail = ({ location: { state } }) => {
    const [isOpen, setOpen] = useState(false)
    const [trackId, setTrackId] = useState("")
    const [flag, setFlag] = useState(false)
    const [sessionId, setSessionId] = useState()
    const [val, setVal] = useState("")
    const [formflag, setFormFlag] = useState(false);
    const [error, setError] = useState(null)
    const [simMovie, setsimMovie] = useState();

    const styleAddButton = {
        color: "white",
        backgroundColor: "rgba(19,85,124,0.8)",
        borderColor: "rgb(145, 86, 168)",
        padding: "7px",
        borderRadius: "5px",
        borderWidth: "3px ",
        fontSize: "1rem",
        marginRight: "20px"
    }

    const styleRate = {
        color: "white",
        backgroundColor: "rgba(19,85,124,0.8)",
        borderColor: "rgb(145, 86, 168)",
        padding: "7px",
        borderRadius: "5px",
        borderWidth: "3px ",
        fontSize: "1rem",
    }

    const fetchData = async () => {

        const { data: { results } } = await axios.get(`https://api.themoviedb.org/3/movie/${state.id}/videos?api_key=2ab876e9698659187d8d9420ef4d232c&language=en-US`)
        setTrackId(results[0].key)
    }

    const similarData = async () => {
        const simData = await axios.get(`https://api.themoviedb.org/3/movie/${state.id}/similar?api_key=2ab876e9698659187d8d9420ef4d232c&language=en-US&page=1`)
        setsimMovie(simData.data.results)
    }
    console.log(simMovie)

    useEffect(() => {
        fetchData()
        similarData()
    }, [])


    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setFlag(true)
            } else {
                setFlag(false)
            }
        })
    }, [])

    const rateMovie = async () => {
        setFormFlag(!formflag)
        let { data: { guest_session_id } } = await axios.get("https://api.themoviedb.org/3/authentication/guest_session/new?api_key=2ab876e9698659187d8d9420ef4d232c")
        setSessionId(guest_session_id)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            let res = await axios.post(`https://api.themoviedb.org/3/movie/${state.id}/rating?api_key=2ab876e9698659187d8d9420ef4d232c&guest_session_id=${sessionId}`, {
                "value": val
            })
            setFormFlag(!formflag)
        } catch (error) {
            setError(error)
        }
    }
    const fav = {
        title: state.title,
        path: state.poster_path
    }
    const addFirestore = () => {

        if (favArray.indexOf(state.title) < 0) {
            console.log(favArray)
            favArray.push(state.title)
            db.collection("favoriteMovies").add(fav)
        }

    }

    const imageURL = "https://image.tmdb.org/t/p/w1280/" + state.poster_path

    return (
        <div>
            <div style={{ color: "white", display: "flex", justifyContent: 'space-around', paddingTop: 30 }}>


                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>

                    <div
                        className="anaInfo"
                        style={{ backgroundImage: `url(${imageURL})`, marginTop: 15 , width: 500, height: 500, backgroundSize: 'cover', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', borderRadius: 15 }}
                    >

                        <div className="info" style={{ height: 80 }}>

                            <button style={styleAddButton} onClick={addFirestore}>Add To Fav</button>
                            <button style={flag ? styleRate : { display: "none" }} onClick={rateMovie}>Rate Movie</button>

                            <form onSubmit={handleSubmit} style={{ display: formflag ? "flex" : "none", marginTop: 30, alignItems: 'center', justifyContent: 'center' }}>

                                <MovieInput type="number" onChange={(e) => setVal(e.target.value)} />
                                <button type="submit" style={styleAddButton}>send</button>
                            </form>
                            <p style={{ fontFamily: " 'Lobster', cursive ", letterSpacing: 2, fontSize: "1.2rem" }}>{error ? "Input value must be number and between 0-10" : null}</p>

                        </div>

                        <p style={{ position: 'absolute', right: 0, top: 0, backgroundColor: "orange", padding: 5, color: 'black', marginBlockStart: 0 }}>{state.vote_average}</p>

                    </div>

                </div>

                <div style={{ fontFamily: " 'Source Sans Pro', sans-serif ", fontSize: "1.5rem", fontWeight: 'bold', display: 'flex', flexDirection:'column' , alignItems:'center' }}>
                    <div style={{width: "850px"}}>
                        <p style={{marginBlockStart: 10}}>{state.title}</p>
                        <p style={{marginBlockEnd: 10}}>{state.overview}</p>
                        <p style={{marginBlockStart: 10, marginBlockEnd: 15 ,color: '#e1f5fe'}}>Release Date: {state.release_date}</p>
                    </div>

                    <div>
                        <iframe width="560" height="315" src={`https://www.youtube.com/embed/${trackId}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>

                </div>

            </div>
            
            <div>
                <p style={{backgroundColor: "rgba(255,255,255,0.6)", width: '30%',borderRadius: 10, margin: '30px auto 0px ', padding: 6, fontWeight: 'bold', color: '#1a237e'}}>Similar Movies</p>
            </div>

            <StyledMoviesWrapper>
                {
                    simMovie?.map((mov)=>{
                        return(
                            <Card movie={mov}/>
                        )
                    })
                }
            </StyledMoviesWrapper>
        </div>
    )
}

















// adult: false
// backdrop_path: "/rcQZmnhcb6P4mkgJAHnCYp3c1gp.jpg"
// genre_ids: (4) [14, 18, 35, 10751]
// id: 11395
// original_language: "en"
// original_title: "The Santa Clause"
// overview: "Scott Calvin is an ordinary man, who accidentally causes Santa Claus to fall from his roof on Christmas Eve and is knocked unconscious. When he and his young son finish Santa's trip and deliveries, they go to the North Pole, where Scott learns he must become the new Santa and convince those he loves that he is indeed, Father Christmas."
// popularity: 37.024
// poster_path: "/tBHDVtEcMl06FbCURRLGVg3TpXp.jpg"
// release_date: "1994-11-11"
// title: "The Santa Clause"
// video: false
// vote_average: 6.4
// vote_count: 1278