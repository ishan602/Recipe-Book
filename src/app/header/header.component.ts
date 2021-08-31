import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubs: Subscription;
  isAuthentication: boolean = false;
  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService
  ) {}
  onSaveRecipe() {
    this.dataStorageService.storeRecipes();
  }
  onFetchRecipe() {
    this.dataStorageService.fetchData().subscribe();
  }

  ngOnInit() {
    this.userSubs = this.authService.user.subscribe((user) => {
      this.isAuthentication = !!user;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userSubs.unsubscribe();
  }
}
