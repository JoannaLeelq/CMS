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
  async get(funcName, params) {
    console.log(funcName);
    console.log(params);
    return axiosInstance
      .get(`/${funcName}`, {
        params: params,
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => this.errorHandler(err));
  }

  async post(path, params) {
    console.log(params);
    return axiosInstance
      .post(path, params)
      .then((res) => res.data)
      .catch((err) => this.errorHandler(err));
  }

  // HTTP status
  isError(code) {
    return !(code.toString().startsWith('2') || code.toString().startsWith('3'));
  }

  // api message
  showMessage(response) {
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
    console.log(request);
    return this.get(rootPath.students, request);
  }

  logout(request) {
    return this.post(rootPath.logout, request).then((res) => this.showMessage(res));
  }
}

const apiService = new ApiService();

export default apiService;
