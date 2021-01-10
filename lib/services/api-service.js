import { rootPath, subPath } from './api-path';
import axios, { AxiosError } from 'axios';
import { message } from 'antd';

// const axios = require('axios');

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3000/api',
  responseType: 'json',
});

class BaseApiService {
  async get(path, params) {
    path = this.creatUrl(path);
    path = !!params
      ? `${path}?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      : path;
    return axiosInstance
      .get(path)
      .then((response) => {
        return response.data;
      })
      .catch((err) => this.errorHandler(err));
  }

  async post(path, params) {
    return axiosInstance
      .post(this.creatUrl(path), params)
      .then((res) => res.data)
      .catch((err) => this.errorHandler(err));
  }

  async delete(path, params) {
    return axiosInstance
      .delete(this.creatUrl(path), { params })
      .then((res) => res.data)
      .catch((err) => this.errorHandler(err));
  }

  // HTTP status
  isError(code) {
    if (!!code) {
      return !(code.toString().startsWith('2') || code.toString().startsWith('3'));
    }
  }

  // api message
  showMessage(response) {
    console.log(response);
    const { code, msg } = response;
    const isError = this.isError(code);

    if (isError) {
      message.error(msg);
    }

    if (!isError) {
      message.success(msg);
    }
    return response;
  }

  errorHandler(err) {
    const msg = err.response.data.msg;
    const code = err.response.status;

    return { msg, code };
  }

  creatUrl(paths, params) {
    return typeof paths === 'string' ? paths : paths.join('/');
    // paths = typeof paths === 'string' ? paths : paths.join('/');
    // let queryParams = '';

    // if (!!params) {
    //   queryParams = Object.entries({})
    //     .map(([key, value]) => `${key}=${value}`)
    //     .join('&');
    // }

    // return `${path}?${queryParams}`;
  }
}

class ApiService extends BaseApiService {
  login(request) {
    return this.get(rootPath.login, request).then((res) => this.showMessage(res));
  }

  getStudent(request) {
    return this.get(rootPath.students, request);
  }

  addStudent(request) {
    return this.post([rootPath.students, subPath.add], request).then((res) =>
      this.showMessage(res)
    );
  }

  updateStudent(request) {
    return this.post([rootPath.students, subPath.update], request).then((res) =>
      this.showMessage(res)
    );
  }

  getStudentProfile(request) {
    return this.get(rootPath.student, request).then((res) => this.showMessage(res));
  }

  deleteStudent(request) {
    return this.delete([rootPath.students, subPath.delete], request).then((res) =>
      this.showMessage(res)
    );
  }

  logout(request) {
    return this.post(rootPath.logout, request).then((res) => this.showMessage(res));
  }
}

const apiService = new ApiService();

export default apiService;
