import { Component } from "@angular/core";

@Component({
  selector: "app-loader",
  styleUrls: ["./loader.component.css"],
  template:
    "<div class='lds-ring'><div></div><div></div><div></div><div></div></div>",
})
export class Loader {}
