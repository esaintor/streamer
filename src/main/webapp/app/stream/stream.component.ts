import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SERVER_API_URL } from 'app/app.constants';
import { HttpClient } from '@angular/common/http';

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
      const element = document.getElementById('streamer') as HTMLVideoElement;
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
      const element = document.getElementById('streamer') as HTMLVideoElement;
      element.src = '/file/d' + this.path;
      element.play();
    } else {
      this.getBack(this.path);
    }
  }
}
