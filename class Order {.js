class Order {
  constructor(allIngredients) {
    let numFillings = int(random(2, 6)); // random number of middle ingredients
    this.ingredients = new Array(numFillings + 2); // +2 for bread on top and bottom

    this.ingredients[0] = "bread"; // top bread

    for (let i = 1; i <= numFillings; i++) {
      // pick random filling (not bread)
      let randomIngredient = random(allIngredients);
      while (randomIngredient === "bread") {
        randomIngredient = random(allIngredients);
      }
      this.ingredients[i] = randomIngredient;
    }

    this.ingredients[this.ingredients.length - 1] = "bread"; // bottom bread
  }

  display(x, y) {
    fill(0);
    textSize(16);
    textAlign(LEFT);
    text("ORDER:", x, y);
    for (let i = 0; i < this.ingredients.length; i++) {
      text(`- ${this.ingredients[i]}`, x, y + 20 * (i + 1));
    }
  }
}