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
  playerHeight = window.innerHeight - 96;
  episodes = [];
  count = 0;
  current = 0;

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
      this.getNext(false);
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
    this.count = 0;
    this.route.queryParams.subscribe(params => {
      this.path = params.path;
      this.getList(params.path);
      this.name = params.name;
      this.current = params.current;
      this.saveToStorage();
      this.playIt(this.path);
    });
  }

  playIt(path) {
    const _this = this;
    const element = document.getElementById('streamer') as HTMLVideoElement;
    element.src = SERVER_API_URL + '/file/d' + path;
    element.play();
    element.addEventListener('ended', () => {
      _this.getNext(true);
    });
  }

  getBack(currentPath) {
    const path = this.getPath(currentPath);
    const element = document.getElementById('streamer') as HTMLVideoElement;
    element.src = '';
    this.current = element.currentTime;
    this.saveToStorage();
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

  getNext(auto) {
    if (auto) {
      this.count = this.count + 1;
    } else {
      this.count = 0;
    }
    if (this.count < 3) {
      const currentIndex = this.episodes.indexOf(this.name);
      const nextIndex = currentIndex + 1;
      const path = this.getPath(this.path) + '/' + this.episodes[nextIndex];
      const name = this.episodes[nextIndex];
      if (this.episodes[nextIndex] !== undefined) {
        this.path = path;
        this.name = name;
        // this.router.navigate(['/stream'], { queryParams: { path, name } });
        this.playIt(this.path);
      } else {
        this.getBack(this.path);
      }
    } else {
      this.getBack(this.path);
    }
  }

  saveToStorage() {
    const path = this.path;
    const username = localStorage.getItem('username');
    const parent = '/' + this.path.split('/')[1] + '/' + this.path.split('/')[2];
    const current = this.current.toString();
    if (username) {
      this.http
        .post(
          SERVER_API_URL + '/ftp/save',
          {},
          {
            params: {
              path,
              parent,
              username,
              current
            }
          }
        )
        .subscribe((response: any) => {
          console.log(response);
        });
    }
  }
}
