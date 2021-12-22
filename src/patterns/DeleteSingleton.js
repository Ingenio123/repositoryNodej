const path = require("path");
const { remove } = require("fs-extra");
class CDelete {
  constructor() {
    remove(path.resolve("./tmp"))
      .then((res) => console.log(res))
      .catch((_error) => {
        console.error(_error);
      });
  }
}

class CDeleteSingleton {
  static instancia; // undefined
  delete = new CDelete();
  constructor(delet) {
    if (!!CDelete.instancia) {
      return CDelete.instancia;
    }
    CDelete.instancia = this;
    this.delete = delet;
  }
}

module.exports = CDeleteSingleton;
