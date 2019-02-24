import React from 'react';
import PropTypes from 'prop-types';
import './AudioPlayer.css';

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSongIndex: 0,
      timeLeft: 0,
      play: this.props.autoPlay || false,
      progress: 0,
    };
  }

  /**
   * Getting reference of autioContainer from audio Element
   * and adding timeupdate and ended eventlistener to track changes
   */
  componentDidMount() {
    const audioContainer = this.audioContainer;
    audioContainer.addEventListener('timeupdate', this.updateProgress);
    audioContainer.addEventListener('ended', this.end);
  }

  /**
   * Removing reference of autioContainer and removing timeupdate and ended eventlistener
   */
  componentWillUnmount() {
    const audioContainer = this.audioContainer;
    audioContainer.removeEventListener('timeupdate', this.updateProgress);
    audioContainer.removeEventListener('ended', this.end);
  }

  /**
   * Helper method to play song
   * updates index of the song playing, resets timeleft of the song playing and progress
   * @param {Integer} index
   */
  _playSong(index) {
    this.setState(
      {
        currentSongIndex: index,
        timeLeft: 0,
        play: true,
        progress: 0,
      },
      () => {
        this.audioContainer.currentTime = 0;
        this.audioContainer.play();
      }
    );
  }

  /**
   * Helper method to format and update the remaining time to be displayed for currentSong
   * @param {Integer} time
   */
  _formatTime(time) {
    if (isNaN(time) || time === 0) {
      return;
    }
    const mins = Math.floor(time / 60);
    const secs = (time % 60).toFixed();
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  /**
   * Helper method to track and update progress of current song
   */
  updateProgress = () => {
    const duration = this.audioContainer.duration;
    const currentTime = this.audioContainer.currentTime;
    const progress = currentTime / duration;
    this.setState({
      progress: progress,
      timeLeft: duration - currentTime,
    });
  };

  end = () => {
    this.handleNext();
  };

  /**
   * Helper method to update progress bar and current song being played when user clicks
   * on the progress bar
   */
  handleAdjustProgress = e => {
    const progressContainer = this.progressContainer;
    const progress =
      (e.clientX - progressContainer.getBoundingClientRect().left) /
      progressContainer.clientWidth;
    const currentTime = this.audioContainer.duration * progress;
    this.audioContainer.currentTime = currentTime;
    this.setState(
      {
        play: true,
        progress: progress,
      },
      () => {
        this.audioContainer.play();
      }
    );
  };

  /**
   * Toggle between play and pause
   */
  handleToggle = () => {
    this.state.play ? this.audioContainer.pause() : this.audioContainer.play();
    this.setState({ play: !this.state.play });
  };

  /**
   * Play previous song
   * (Checks the condition when the current song is the first, then goes to the last song of the playlist)
   */
  handlePrev = () => {
    const { currentSongIndex } = this.state;
    const total = this.props.playListData.tracks.length;
    const index = currentSongIndex > 0 ? currentSongIndex - 1 : total - 1;
    this._playSong(index);
  };

  /**
   * Play next song
   * (Checks the condition when the current song is the last, then goes to the first song of the playlist)
   */
  handleNext = () => {
    const { currentSongIndex } = this.state;
    const total = this.props.playListData.tracks.length;
    const index = currentSongIndex < total - 1 ? currentSongIndex + 1 : 0;
    this._playSong(index);
  };

  render() {
    const { playListData } = this.props;
    const { currentSongIndex, timeLeft, play, progress } = this.state;
    const currentSong = playListData.tracks[currentSongIndex];
    const progressStyle = {
      width: `${progress * 100}%`,
    };

    return (
      <div className='ap-container'>
        {/* Audio Element Starts */}
        <audio
          autoPlay={play}
          preload='auto'
          ref={ref => {
            this.audioContainer = ref;
          }}
          src={currentSong.url}
        />
        {/* Audio Element Ends */}

        {/* Album Cover Starts */}
        <div className='ap-album-cover'>
          <img src={currentSong.cover_image} alt={currentSong.name} />
        </div>
        {/* Album Cover Ends */}

        {/* Audio Player Controls Start */}
        <div className='ap-controls'>
          {/* Audio Player Buttons(back, forward, play/pause) Start */}
          <div className='ap-controls-left'>
            <i className='ap-step-backward' onClick={this.handlePrev} />
            <i
              className={`ap-${play ? 'pause' : 'play'}`}
              onClick={this.handleToggle}
            />
            <i className='ap-step-forward' onClick={this.handleNext} />
          </div>
          {/* Audio Player Buttons Ends */}

          {/*Audio Player Song Description Details Start  */}
          <div className='ap-controls-right'>
            <div className='ap-album-name'>{currentSong.name}</div>
            <div
              className='ap-progress-container'
              onClick={this.handleAdjustProgress}
              ref={ref => {
                this.progressContainer = ref;
              }}
            >
              <div className='ap-progress' style={progressStyle} />
            </div>
            <div className='ap-artist'>
              <div className='ap-artist-name'>{playListData.artist}</div>
              <div className='ap-timeleft'>{this._formatTime(timeLeft)}</div>
            </div>
          </div>
          {/*Audio Player Song Description Details End  */}
        </div>
        {/* Audio Player Controls Ends */}
      </div>
    );
  }

  static propTypes = {
    autoPlay: PropTypes.bool,
    playListData: PropTypes.object.isRequired,
  };

  static defaultProps = {
    autoPlay: false,
    playListData: {},
  };
}

export default AudioPlayer;
