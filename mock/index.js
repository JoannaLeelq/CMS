import { Server, Model, Response } from 'miragejs';

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
        '/login',
        (schema, request) => {
          //   debugger;
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
        '/dashboard',
        (schema, _) => {
          // debugger;
          let allStudentData = schema.students.all();
          // return allStudentData;
          return new Response(
            200,
            {},
            {
              data: { students: allStudentData },
              msg: 'success',
              code: 200,
            }
          );
        },
        { timing: 4000 }
      );

      this.get(
        '/logoutApp',
        (_, request) => {
          // debugger;
          let req = request.queryParams;
          if (!!req.token) {
            return new Response(200, {}, { data: req.token, msg: 'success', code: 200 });
          } else {
            return new Response(400, {}, { msg: 'Token is not exist', code: 400 });
          }
        },
        { timing: 1000 }
      );
    },
  });

  return server;
}
