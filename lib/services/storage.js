export class Storage {
  setUserInfo(useInfo) {
    localStorage.setItem('cms', JSON.stringify(useInfo));
  }

  getUserInfo() {
    try {
      return JSON.parse(localStorage.getItem('cms'));
    } catch (error) {
      return null;
    }
  }

  deleteUserInfo() {
    localStorage.removeItem('cms');
  }
}

const storage = new Storage();

export default storage;
