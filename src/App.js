import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import { ReactMic } from 'react-mic';
import { decode } from 'node-wav';
import * as tf from '@tensorflow/tfjs';
import { input } from '@tensorflow/tfjs';
import * as wav from 'node-wav';
import * as fs from 'fs';

// import * as tfn from '@tensorflow/tfjs-node';
// let audio = [];

const URL =
  'https://cors-anywhere.herokuapp.com/' +
  'https://sample-bucket095.s3.us-east-2.amazonaws.com/export_1.0/model.json';

export class Example extends Component {
  constructor(props) {
    super(props);
    this.mic = null;
    this.model = null;
    this.state = {
      record: false,
    };
    this.sec_5 = [];
    this.config = {
      fftSize: 1024,
      sampleRateHz: 48000,
      numFramesPerSpectrogram: 267,
      columnTruncateLength: 513,
    };
    // this.tick = null;
  }

  componentDidMount() {
    // this.startMic();
    // setInterval(this.getAudioData, 5000);
    console.log('starting mic ... ');
    this.getAudioData();
  }

  getAudioData = async () => {
    this.mic = await tf.data.microphone({
      fftSize: this.config.fftSize,
      columnTruncateLength: this.config.columnTruncateLength,
      numFramesPerSpectrogram: this.config.numFramesPerSpectrogram,
      sampleRateHz: this.config.sampleRateHz,
      includeSpectrogram: true,
    });
    console.log('init mic data .. and collecting ');
    setInterval(this.startCollectingDate, 5000);
  };

  startCollectingDate = async () => {
    const micData = await this.mic.capture();
    let spec = micData.spectrogram;
    // spec = tf.div(spec, spec.norm());
    spec.print();
    // micData.spectrogram.prin();
  };

  startMic = async () => {
    this.mic = await tf.data.microphone({
      fftSize: this.config.fftSize,
      columnTruncateLength: this.config.columnTruncateLength,
      numFramesPerSpectrogram: this.config.numFramesPerSpectrogram,
      sampleRateHz: this.config.sampleRateHz,
      includeSpectrogram: true,
    });
    // this.model = await tf.loadLayersModel('http://192.168.1.6:8080/model.json');
    const interval = (this.config.fftSize / this.config.sampleRateHz) * 1e3;
    console.log('interval rate', interval);
    console.time('Execution Time');
    setInterval(this.getTensor, interval);
  };

  getTensor = async () => {
    const audioData = await this.mic.capture();
    const spectrogram = audioData.spectrogram;
    // spectrogram.print();
    this.sec_5.push(spectrogram);
    // console.log(this.sec_5.length);
    if (this.sec_5.length == this.frameInterval) {
      this.process_data();
    }
    // console.log(spectrogram.shape);
  };
  process_data = () => {
    console.timeEnd('Execution Time');
    let temp = tf.concat(this.sec_5);

    // let input = tf.reshape(temp, [1, 500, 201]);
    temp = tf.div(temp, temp.norm());
    temp.print();
    // temp.print();
    // console.log(temp.shape);
    this.sec_5 = [];
    // let ans = this.model.predict(input);
    // ans = tf.reshape(ans, [11]);
    // ans.print();
    // ans.argMax().print();
    // this.sec_5 = [];
  };

  startRecording = () => {
    this.setState({ record: true });
  };

  stopRecording = () => {
    this.setState({ record: false });
  };

  onData(recordedBlob) {
    let sample = recordedBlob.arrayBuffer();
    sample.then((data) => {
      console.log(data);
    });
  }

  dataRead = async (url) => {
    let data = await fetch(url).then((r) => r.blob());
    return data;
  };

  onStop(recordedBlob) {
    console.log('recordedBlob is: ', recordedBlob);
    // wav.decode(data);
  }

  render() {
    return (
      <div>
        <ReactMic
          record={this.state.record}
          className="sinewave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#000000"
          channelCount={1}
          backgroundColor="#FF4081"
        />
        <button onClick={this.startRecording} type="button">
          Start
        </button>
        <button onClick={this.stopRecording} type="button">
          Stop
        </button>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Gathering Detector
        <h3> Number of people in the room are </h3>
        <h1> 3 </h1>
      </header>
      <Example />
    </div>
  );
}

export default App;
