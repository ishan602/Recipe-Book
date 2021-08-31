import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: "root" })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http
      .put(
        "https://angular-recipe-51031-default-rtdb.firebaseio.com/recipe.json",
        recipes
      )
      .subscribe((respData) => {
        console.log(respData);
      });
  }
  fetchData() {
    return this.http
      .get<Recipe[]>(
        "https://angular-recipe-51031-default-rtdb.firebaseio.com/recipe.json"
      )
      .pipe(
        map((respData) => {
          return respData.map((respItem) => {
            return {
              ...respItem,
              ingredients: respItem.ingredients ? respItem.ingredients : [],
            };
          });
        }),
        tap((respData) => {
          this.recipesService.setRecipes(respData);
        })
      );

    // return this.http
    //   .get<Recipe[]>(
    //     "https://angular-recipe-51031-default-rtdb.firebaseio.com/recipe.json"
    //   )
    //   .pipe(
    //     map((respData) => {
    //       return respData.map((respItem) => {
    //         return {
    //           ...respItem,
    //           ingredients: respItem.ingredients ? respItem.ingredients : [],
    //         };
    //       });
    //     }),
    //     tap((respData) => {
    //       this.recipesService.setRecipes(respData);
    //     })
    //   );
  }
}
