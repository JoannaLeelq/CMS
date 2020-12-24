import { Server, Model, Response } from 'miragejs';
import { rootPath, subPath } from '../lib/services/api-path';

export function makeServer({ environment = 'development' } = {}) {
  let users = require('./user.json');
  let students = require('./student.json');
  let server = new Server({
    environment,

    models: {
      users: Model,
      students: Model,
    },

    seeds(server) {
      students.forEach((student) => {
        server.create('student', student);
      });
      users.forEach((user) => {
        server.create('user', user);
      });
    },

    routes() {
      this.passthrough((request) => {
        if (request.url === '/_next/static/development/_devPagesManifest.json') {
          return true;
        }
      });

      this.namespace = 'api';

      this.get(
        rootPath.login,
        (schema, request) => {
          let req = request.queryParams;
          let user = schema.users.where({
            email: req.email,
            password: req.password,
            type: req.loginType,
          });

          if (!!user.length) {
            return new Response(
              200,
              {},
              {
                data: {
                  token: Math.random().toString(32).split('.')[1],
                  loginType: req.loginType,
                },
                code: 200,
                msg: 'login success',
              }
            );
          } else {
            return new Response(403, {}, { msg: 'check user or email', code: 400 });
          }
        },
        { timing: 1000 }
      );

      this.get(
        rootPath.students,
        (schema, request) => {
          debugger;
          let req = request.queryParams;
          let limit = req.limit;
          let page = req.page;
          let query = req.query;
          let allStudentData = schema.students.all().models;
          let students = allStudentData.filter((student) => !query || student.name.includes(query));

          const total = !query ? allStudentData.length : students.length;
          let data = { total, students };

          if (limit && page) {
            const start = limit * (page - 1);
            students = students.slice(start, start + limit);
            data = { ...data, paginator: { page, limit, total } };
          }

          // return allStudentData;
          return new Response(
            200,
            {},
            {
              data: { ...data, students },
              msg: 'success',
              code: 200,
            }
          );
        },
        { timing: 4000 }
      );

      this.post(
        rootPath.logout,
        (_, request) => {
          return new Response(200, {}, { data: true, msg: 'success', code: 200 });
        },
        { timing: 1000 }
      );
    },
  });

  return server;
}
