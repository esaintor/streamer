import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, AccountService, Account } from 'app/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from 'app/app.constants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
  account: Account;
  modalRef: NgbModalRef;
  list: any[] = [];
  currentPath = '';
  steps = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params !== undefined && params.path !== undefined) {
        this.currentPath = params.path;
        this.toSteps(this.currentPath);
      } else {
        this.getList();
      }
    });
  }

  registerAuthenticationSuccess() {
    this.eventManager.subscribe('authenticationSuccess', message => {
      this.accountService.identity().then(account => {
        this.account = account;
      });
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  login() {
    this.modalRef = this.loginModalService.open();
  }

  getList(path?) {
    if (path === undefined) {
      path = 'parent';
    } else {
      path = path;
    }
    this.http.get(SERVER_API_URL + '/ftp/list', { params: { path } }).subscribe(response => {
      this.list = JSON.parse(JSON.stringify(response));
    });
  }

  getBackPath() {
    this.steps.pop();
    this.buildPath();
    this.getList(this.currentPath);
  }

  getForwardPath(item: string) {
    this.steps.push(item);
    this.buildPath();
    if (item.includes('.mp4') || item.includes('.mkv')) {
      this.playVideo(this.currentPath, item);
    } else {
      this.getList(this.currentPath);
    }
  }

  playVideo(path, name) {
    this.router.navigate(['stream'], { queryParams: { path, name } });
  }

  buildPath() {
    this.currentPath = '';
    this.steps
      .filter(step => step !== '')
      .forEach(step => {
        this.currentPath = this.currentPath + '/' + step;
      });
  }

  toSteps(path: string) {
    this.steps = [];
    if (path !== undefined) {
      path
        .split('/')
        .filter(step => step !== '')
        .forEach(step => {
          this.steps.push(step);
        });
      this.buildPath();
      this.getList(this.currentPath);
    }
  }

  isVideo(item: string): boolean {
    return item.includes('.mp4') ? true : false;
  }
}
