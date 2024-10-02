class Car {
  #brand;  // Private property
  #model;  // Private property

  constructor(brand, model) {
      this.#brand = brand;
      this.#model = model;
      this.speed = 0; // Speed starts at 0
  }

  // Method to display the brand, model, and speed of the car
  displayInfo() {
      console.log(`Brand: ${this.#brand}, Model: ${this.#model}, Speed: ${this.speed} km/h`);
  }

  // Method to increase the speed by 5, without exceeding 200
  go() {
      if (this.speed + 5 <= 200) {
          this.speed += 5;
      } else {
          this.speed = 200;
      }
  }

  // Method to decrease the speed by 5, without going below 0
  brake() {
      if (this.speed - 5 >= 0) {
          this.speed -= 5;
      } else {
          this.speed = 0;
      }
  }
}

class RaceCar extends Car {
  #acceleration;  // Private property

  constructor(brand, model, acceleration) {
      super(brand, model); // Call the parent class constructor
      this.#acceleration = acceleration; // Acceleration is specific to RaceCar
  }

  // Method to display the brand, model, speed, and acceleration of the race car
  displayInfo() {
      console.log(`Brand: ${this.#brand}, Model: ${this.#model}, Speed: ${this.speed} km/h, Acceleration: ${this.#acceleration} m/s²`);
  }

  // Method to accelerate the car, increasing the speed based on acceleration value
  accelerate() {
      const potentialSpeed = this.speed + this.#acceleration;
      this.speed = potentialSpeed > 200 ? 200 : potentialSpeed;
  }
}

// Create an instance of the RaceCar class
const raceCar1 = new RaceCar("Ferrari", "F8", 20);

// Call the methods and display the info
raceCar1.displayInfo(); // Output: Brand: Ferrari, Model: F8, Speed: 0 km/h, Acceleration: 20 m/s²

raceCar1.accelerate();
raceCar1.displayInfo(); // Output: Brand: Ferrari, Model: F8, Speed: 20 km/h, Acceleration: 20 m/s²

raceCar1.accelerate();
raceCar1.displayInfo(); // Output: Brand: Ferrari, Model: F8, Speed: 40 km/h, Acceleration: 20 m/s²

raceCar1.brake();
raceCar1.displayInfo(); // Output: Brand: Ferrari, Model: F8, Speed: 35 km/h, Acceleration: 20 m/s²
