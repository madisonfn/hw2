class Ingredient {
  constructor(name, img, x, y, w, h) {
    this.name = name; // used to check if orders are right
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isDragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  display() {
    image(this.img, this.x, this.y, this.w, this.h);
  }

  isMouseOver() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    );
  }

  startDrag() {
    this.isDragging = true;
    this.offsetX = mouseX - this.x;
    this.offsetY = mouseY - this.y;
  }

  stopDrag() {
    this.isDragging = false;
  }

  displayIngredient() {
    if (this.isMouseOver()) return this.name;
    return "";
  }

  update() {
    if (this.isDragging) {
      this.x = mouseX - this.offsetX;
      this.y = mouseY - this.offsetY;
    }
  }
}
