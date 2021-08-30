import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Ingredient } from "src/app/shared/ingredient.model";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
  selector: "app-recipe-edit",
  templateUrl: "./recipe-edit.component.html",
  styleUrls: ["./recipe-edit.component.css"],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.editMode = params["id"] != null;
      this.initForm();
    });
  }

  private initForm() {
    let recipeName: string = "";
    let recipeDescription: string = "";
    let imgPath: string = "";
    let recipeIngredients = new FormArray([]);
    // let ingredient: Ingredient;
    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeDescription = recipe.description;
      imgPath = recipe.imagePath;
      // Now ingredient is of type FormArray which will contains an array of FormControl, since our ingredient contains a name and amount so we will push these two into one formGroup
      if (recipe.ingredients) {
        for (let ingredientItem of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredientItem.name, Validators.required),
              amount: new FormControl(ingredientItem.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      recipeDesc: new FormControl(recipeDescription, Validators.required),
      imgPath: new FormControl(imgPath, Validators.required),
      ingredients: recipeIngredients,
    });
  }
  get controls() {
    // a getter!
    return (<FormArray>this.recipeForm.get("ingredients")).controls;
  }
  addIngredient() {
    console.log("called");
    (<FormArray>this.recipeForm.get("ingredients")).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onSubmit() {
    console.log(this.recipeForm.value);
    const newRecipe = new Recipe(
      this.recipeForm.value["name"],
      this.recipeForm.value["recipeDesc"],
      this.recipeForm.value["imgPath"],
      this.recipeForm.value["ingredients"]
    );
    this.editMode
      ? this.recipeService.updateRecipe(this.id, newRecipe)
      : this.recipeService.addRecipe(newRecipe);

    this.onCancel();
  }
  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get("ingredients")).removeAt(index);
  }
  onCancel() {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
