function UserWithConstructorFunction() {
  this.name = "John";
  this.surname = "Smith";
  this.sayHi = function () {
    alert(`Hi! ${this.name}`);
  };
  Object.defineProperty(this, 'fullName', {
    get () {
      return `${this.name} ${this.surname}`;
    },
    set (value) {
      [this.name, this.surname] = value.split(" ");
    }
  })
}

const user1 = new UserWithConstructorFunction();
alert(user1.fullName);
user1.fullName = "Alice Cooper";
alert(user1.fullName);

// -------------- Similar as above in Class -------------- //

class UserWithClass {
  constructor() {
    this.name = "John";
    this.surname = "Smith";
  }

  sayHi() {
    alert(`Hi! ${this.name}`);
  }

  get fullName () {
    return `${this.name} ${this.surname}`;
  }

  set fullName (value) {
    [this.name, this.surname] = value.split(" ");
  }
}

const user2 = new UserWithClass();
alert(user2.fullName);
user2.fullName = "Alice Cooper";
alert(user2.fullName);

// -------------- Similar as above in Object literal -------------- //

const user3 = {
  name: "John",
  surname: "Smith",
  fullName: "",
  get fullName() {
    return `${this.name} ${this.surname}`;
  },

  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  }
};

alert(user3.fullName);
user3.fullName = "Alice Cooper";
alert(user3.fullName);


// ----------- EXAMPLE CALLBACKS WITH "this" PASSED TO SUCCESSORS IN ARROW FUNC CASE -------------- //

let user = {
  firstName: "Ilya",
  sayHi() {
    let arrow = () => {
      console.log(this.firstName, 1);
      const someFunc = (cb) => {
        console.log(2);
        setTimeout(() => {
          console.log(3);
          cb(() => {
            console.log(5);
            console.log(this + this?.firstName + ' in timeout')
          });
        }, 8000);
      }
      someFunc((cb1) => {
        console.log(4);
        cb1();
      });
    };
    // const ctx = this;
    // setTimeout(function () {
    //   console.log(ctx + ctx?.firstName + ' in timeout');
    // }, 3000);
    arrow();
  }
};

user.sayHi(); // Ilya
