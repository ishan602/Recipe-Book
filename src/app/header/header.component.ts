import { Component, OnInit } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit {
  constructor(private dataStorageService: DataStorageService) {}
  onSaveRecipe() {
    this.dataStorageService.storeRecipes();
  }
  onFetchRecipe() {
    this.dataStorageService.fetchData().subscribe();
  }

  ngOnInit() {
    this.onFetchRecipe();
  }
}
