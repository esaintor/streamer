import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SERVER_API_URL } from 'app/app.constants';
import { HttpClient } from '@angular/common/http';
import VTTConverter from 'srt-webvtt';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  FULL_BUTTON = 70,
  BACK_TO_BROWSE = 8,
  PAUSE_PLAY = 32,
  NEXT_PLAY = 78
}

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html'
})
export class StreamComponent implements OnInit {
  path = '';
  srt = '';
  name = '';
  episodes = [];

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const element = document.getElementById('streamer') as HTMLVideoElement;

    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      element.currentTime += 15;
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      element.currentTime -= 15;
    }

    if (event.keyCode === KEY_CODE.BACK_TO_BROWSE) {
      this.getBack(this.path);
    }

    if (event.keyCode === KEY_CODE.NEXT_PLAY) {
      this.getNext();
    }

    if (event.keyCode === KEY_CODE.FULL_BUTTON) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
        // @ts-ignore
      } else if (element.mozRequestFullScreen) {
        /* Firefox */
        // @ts-ignore
        element.mozRequestFullScreen();
        // @ts-ignore
      } else if (element.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        // @ts-ignore
        element.webkitRequestFullscreen();
        // @ts-ignore
      } else if (element.msRequestFullscreen) {
        /* IE/Edge */
        // @ts-ignore
        element.msRequestFullscreen();
      }
    }

    if (event.keyCode === KEY_CODE.PAUSE_PLAY) {
      if (element.paused) {
        element.play();
      } else {
        element.pause();
      }
    }
  }

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.path = params.path;
      this.getList(params.path);
      this.name = params.name;
      this.getSubtitle();
      this.saveToStorage();
      const element = document.getElementById('streamer') as HTMLVideoElement;
      element.src = '/file/d' + this.path;
      element.play();
      const _this = this;
      element.addEventListener('ended', () => {
        _this.getNext();
      });
    });
  }

  getBack(currentPath) {
    const path = this.getPath(currentPath);
    this.router.navigate(['/'], { queryParams: { path } });
  }

  getList(currentPath) {
    const path = this.getPath(currentPath);
    this.http.get(SERVER_API_URL + '/ftp/episodes', { params: { path } }).subscribe(response => {
      this.episodes = JSON.parse(JSON.stringify(response));
    });
  }

  getPath(currentPath): string {
    let path = '';
    const steps = currentPath.split('/');
    for (let i = 0; i < steps.length - 1; i++) {
      if (steps[i] !== '') {
        path = path + '/' + steps[i];
      }
    }
    return path;
  }

  getNext() {
    const currentIndex = this.episodes.indexOf(this.name);
    const nextIndex = currentIndex + 1;
    const path = this.getPath(this.path) + '/' + this.episodes[nextIndex];
    const name = this.episodes[nextIndex];
    if (this.episodes[nextIndex] !== undefined) {
      this.path = path;
      this.name = name;
      this.router.navigate(['/stream'], { queryParams: { path, name } });
    } else {
      this.getBack(this.path);
    }
  }

  getSubtitle() {
    console.log('/file/d' + this.getPath(this.path) + '/' + this.name.split('.')[0] + '.srt');
    this.srt = '/file/d' + this.getPath(this.path) + '/' + this.name.split('.')[0] + '.srt';
    const video = document.getElementById('streamer') as HTMLVideoElement; // Main video element
    video.textTracks[0].mode = 'showing'; // Start showing subtitle to your track
    // this.http.get('/file/d' + this.getPath(this.path) + '/' + this.name.split('.')[0] + '.srt', {responseType: 'blob'}).subscribe(blob => {
    //   const vttConverter = new VTTConverter(blob); // the constructor accepts a parameer of SRT subtitle blob/file object
    //   vttConverter
    //     .getURL()
    //     .then(function(url) { // Its a valid url that can be used further
    //       const track = document.getElementById('caption') as HTMLTrackElement; // Track element (which is child of a video element)
    //       const video = document.getElementById('streamer') as HTMLVideoElement; // Main video element
    //       track.src = url; // Set the converted URL to track's source
    //       track.label = 'English';
    //       track.srclang = 'en';
    //       track.default = true;
    //       video.textTracks[0].mode = 'showing'; // Start showing subtitle to your track
    //     })
    //     .catch(function(err) {
    //       console.error(err);
    //     });
    // });
  }

  saveToStorage() {
    const folder = this.path.split('/')[1];
    const name = this.path.split('/')[2];
    const element = document.getElementById('streamer') as HTMLVideoElement;
    if (localStorage.getItem('/' + folder + '/' + name)) {
      localStorage.removeItem('/' + folder + '/' + name);
      localStorage.setItem('/' + folder + '/' + name, this.path);
    } else {
      localStorage.setItem('/' + folder + '/' + name, this.path);
    }
    localStorage.setItem('currentTime', element.currentTime.toString());
  }
}
