class Player {
  constructor() {
    this.myIngredients = [];
  }

  addIngredient(ing) {
    this.myIngredients.push(ing);
  }

  // check if the order matches exactly
  checkOrder(order) {
    if (this.myIngredients.length !== order.ingredients.length) return false;
    for (let i = 0; i < this.myIngredients.length; i++) {
      if (this.myIngredients[i] !== order.ingredients[i]) return false;
    }
    return true;
  }

  // reset if ingredient order is wrong
  reset() {
    this.myIngredients = [];
  }
}
