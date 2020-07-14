import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Peer from 'peerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('myvideo', {static: true}) myVideo: any;
  title = 'app works!';

  targetpeer: any;
  peer: any;
  n = navigator as any;

  ngOnInit() {
    const video = this.myVideo.nativeElement;
    let peerx: any;
    this.n.getUserMedia = (this.n.getUserMedia || this.n.webkitGetUserMedia || this.n.mozGetUserMedia || this.n.msGetUserMedia);
    // tslint:disable-next-line:only-arrow-functions
    this.n.getUserMedia({video: true, audio: true}, function(stream) {
      peerx = new SimplePeer ({
        initiator: location.hash === '#room',
        trickle: false,
        stream
      });

      peerx.on('signal', function(data) {
        console.log(JSON.stringify(data));
        this.targetpeer = data;
      });

      // tslint:disable-next-line:only-arrow-functions
      peerx.on('data', function(data) {
        console.log('Recieved message:' + data);
      });

      // tslint:disable-next-line:only-arrow-functions
      peerx.on('stream', function(re) {
        const mediaStream = new MediaStream(re);
        video.srcObject = mediaStream;
        video.play();
      });

      // tslint:disable-next-line:only-arrow-functions
    }, function(err){
      console.log('Failed to get stream', err);
    });

    setTimeout(() => {
      this.peer = peerx;
      console.log(this.peer);
    }, 5000);
  }

  connect() {
    this.peer.signal(JSON.parse(this.targetpeer));
  }

  message() {
    this.peer.send('Hello world');
  }

  ngAfterViewInit(): void {
  }
}
