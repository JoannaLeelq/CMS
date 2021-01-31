import { rootPath, subPath } from './api-path';
import axios, { AxiosError } from 'axios';
import { message } from 'antd';
import { rest } from 'lodash';
import storage from '../../lib/services/storage';
import { AES } from 'crypto-js';

// const axios = require('axios');

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_API || 'http://localhost:3001/api',
  responseType: 'json',
});

axiosInstance.interceptors.request.use((config) => {
  if (!config.url.includes('login')) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: 'Bearer ' + storage?.getUserInfo().token,
      },
    };
  }

  return config;
});

class BaseApiService {
  async get(path, params) {
    path = this.creatUrl(path);
    path = !!params
      ? `${path}?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      : path;
    console.log(path);
    return axiosInstance
      .get(path, params)
      .then((response) => {
        return response.data;
      })
      .catch((err) => this.errorHandler(err));
  }

  async post(path, params) {
    path = this.creatUrl(path);
    path = !!params
      ? `${path}?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      : path;
    console.log(params);
    return await axiosInstance
      .post(path, params)
      .then((res) => res.data)
      .catch((err) => this.errorHandler(err));
  }

  async put(path, params) {
    path = this.creatUrl(path);
    path = !!params
      ? `${path}?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
      : path;
    return axiosInstance
      .put(path, params)
      .then((res) => res.data)
      .catch((err) => this.errorHandler(err));
  }

  async delete(path, params) {
    path = this.creatUrl(path) + `/${params.id}`;
    return axiosInstance
      .delete(path)
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
    console.log(err);
    const msg = err.response.data.msg;
    const code = err.response.status;

    return { msg, code };
  }

  creatUrl(paths, params) {
    return typeof paths === 'string' ? paths : paths.join('/');
  }
}

class ApiService extends BaseApiService {
  login(request) {
    return this.post(rootPath.login, {
      email: request.email,
      password: AES.encrypt(request.password, 'cms').toString(),
      role: request.role,
    }).then((res) => {
      return this.showMessage(res);
    });
  }

  signup(request) {
    const { password, ...rest } = request;
    let CryptoJS = require('crypto-js');
    let ciphertext = CryptoJS.AES.encrypt(password, 'cms').toString();

    return this.post(rootPath.signup, {
      ...rest,
      password: ciphertext,
    }).then((res) => this.showMessage(res));
  }

  getAllCountries() {
    return this.get(rootPath.allCountries);
  }

  getStudent(request) {
    return this.get(rootPath.students, request);
  }

  addStudent(request) {
    return this.post(rootPath.students, request).then((res) => this.showMessage(res));
  }

  updateStudent(request) {
    return this.put(rootPath.students, request).then((res) => this.showMessage(res));
  }

  getStudentProfile(request) {
    return this.get([rootPath.students, request.id]).then((res) => this.showMessage(res));
  }

  deleteStudent(request) {
    return this.delete(rootPath.students, request).then((res) => this.showMessage(res));
  }

  getCourses(request) {
    return this.get(rootPath.courses, request).then((res) => this.showMessage(res));
  }

  getCourseDetail(request) {
    return this.get([rootPath.courses, subPath.detail], request).then((res) =>
      this.showMessage(res)
    );
  }

  addCourse(request) {
    return this.post(rootPath.courses, request).then((res) => this.showMessage(res));
  }

  getCourseTypes() {
    return this.get([rootPath.courses, rootPath.type]).then((res) => this.showMessage(res));
  }

  getCourseCodes() {
    return this.get([rootPath.courses, rootPath.courseCodes]).then((res) => this.showMessage(res));
  }

  getTeachers(request) {
    return this.get(rootPath.teachers, request).then((res) => this.showMessage(res));
  }

  logout(request) {
    return this.post(rootPath.logout, request).then((res) => this.showMessage(res));
  }
}

const apiService = new ApiService();

export default apiService;
