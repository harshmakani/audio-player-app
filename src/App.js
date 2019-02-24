import React, { Component } from 'react';
import './App.css';
import playListData from './data/fed_home_assignment_api.json';
import AudioPlayer from './components/AudioPlayer';

/**
 * Considering base scenario where App component is the root component of application
 * and apart from AudioPlayer component, other components can also be added.
 *
 * Loading Audio Player from local dataset
 */
class App extends Component {
  render() {
    return (
      <div className='App'>
        {/* playListData is a required prop for AudioPlayer Component. AudioPlayer also has another prop to autoplay. Pass autoPlay=`true` to start playing song on load.  */}
        <AudioPlayer playListData={playListData} />
      </div>
    );
  }
}

export default App;
