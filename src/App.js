import './App.css';
import play from './assets/play.png'
import pause from './assets/pausa.png'
import { useState } from 'react';

function App() {

  const [musicPlaying, setMusicPlaying] = useState(true),
        [musicName, setMusicName] = useState("Nenhuma Música Selecionada."),
        [artistName, setArtistName] = useState("Selecione uma música."),
        [musicDisplayDuration, setMusicDisplayDuration] = useState("0:00"),
        [musicDisplayState, setMusicDisplayState] = useState("0:00"),
        [musicUrl, setMusicUrl] = useState(""),
        [musicProgress, setMusicProgress] = useState(0),
        [musicInterval, setMusicInterval] = useState([]),
        [audioElement, setAudioElement] = useState();

  function reset(){
    setMusicInterval(clearInterval(musicInterval))
    setMusicDisplayDuration("0:00")
    setMusicDisplayState("0:00")
  }

  function handleMusic(e) {
    e.preventDefault();

    const music = e.target.files[0]

    setMusicName(music.name.split(".")[0])

    if(music.name.split("-").length > 1) {
      setArtistName(music.name.split("-")[0])
      setMusicName(music.name.split(".")[0].split("-")[1])
    } else setArtistName("Artista Desconhecido")

    const temporaryMusicUrl = URL.createObjectURL(music)
    setMusicUrl(temporaryMusicUrl)
  }

  function handlePlaying(e) {
    e.preventDefault();

    reset()
    setMusicPlaying(true)

    const totalSeconds = Math.round(e.target.duration);

    // convert to minutes
    const minutes = Math.floor(totalSeconds / 60);
    // convert to round seconds
    const seconds = Math.floor(totalSeconds % 60);

    // Set music length
    setMusicDisplayDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`)

    // Set interval to refresh progress
    setMusicInterval(setInterval(() => {
      
      const timeState = Math.round(e.target.currentTime);

      const minutes = Math.floor(timeState / 60);
      const seconds = Math.floor(timeState % 60);

      // set progress
      setMusicDisplayState(`${minutes}:${seconds.toString().padStart(2, '0')}`)

      const progress = (timeState * 100 / totalSeconds)
      setMusicProgress(progress)

    }, 1000))

  }

  function handlePause(e) {
    e.preventDefault()

    if (!audioElement) return
 
    if (musicPlaying) audioElement.pause()
    else audioElement.play()

    setMusicPlaying(!musicPlaying)
  }

  function handleVolumeChange(e) {
    const volume = e.target.value / 100

    audioElement.volume = volume
  }
  
  function handleStop(){
    reset()
    setMusicProgress(0)
  }

  return (
    <div className="App">

      <input onInput={handleMusic} type="file" className="musica" accept=".mp3, .wav" />

      <div className="musicData">
        <div className="coverContainer">
          <img className="cover" src="https://http.cat/404" alt="music cover"></img>
        </div>
        <h1 className="title" >{musicName}</h1>
        <h2 className="artist">{artistName}</h2>
      </div>

      <div className="controls">

        <div className="buttons">

          <div></div>

          <div onClick={handlePause} className="play">
            <img className="playImg" src={ musicPlaying ? pause : play } alt="play"></img>
          </div>

          <div>
            <input type="range" defaultValue={100} onChange={handleVolumeChange}/>
          </div>

        </div>

        <div className="musicSize">
          <span className="minutes">{musicDisplayState}</span>
          <span className="duration">{musicDisplayDuration}</span>
        </div>
        <div className="progress">
          <div className="progressBar" style={{width: `${musicProgress}%`}}></div>
        </div>
      </div>

      <audio onEnded={handleStop} onPlay={handlePlaying} onLoadedData={(e) => {setAudioElement(e.target)}}  autoPlay={true} src={musicUrl} />
    </div>
  );
}

export default App;
