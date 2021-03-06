import { Server, Model, Response, belongsTo, hasMany } from 'miragejs';
import { format } from 'date-fns';
import { rootPath, subPath } from '../lib/services/api-path';

export default function makeServer({ environment = 'development' } = {}) {
  let users = require('./user.json');
  let students = require('./student.json');
  let studentTypes = require('./student_type.json');
  let studentCourses = require('./student_course.json');
  let studentProfile = require('./student-profile.json');
  let courses = require('./course.json');
  let courseTypes = require('./course_type.json');
  let teachers = require('./teacher.json');
  let schedule = require('./schedule.json');
  let sales = require('./sales.json');

  let server = new Server({
    environment,

    models: {
      users: Model,
      studentType: Model,
      students: Model.extend({
        type: belongsTo('studentType'),
        studentCourse: hasMany(),
      }),
      teacher: Model,
      courseType: Model,
      course: Model.extend({
        type: belongsTo('courseType'),
        teacher: belongsTo(),
        sales: belongsTo(),
        schedule: belongsTo(),
      }),
      studentCourse: Model.extend({
        course: belongsTo(),
      }),
      studentProfile: Model.extend({
        studentCourse: hasMany(),
        type: belongsTo('studentType'),
      }),
      sales: Model,
      schedule: Model,
    },

    seeds(server) {
      users.forEach((user) => server.create('user', user));
      teachers.forEach((teacher) => server.create('teacher', teacher));
      sales.forEach((sale) => server.create('sale', sale));
      schedule.forEach((schedule) => server.create('schedule', schedule));
      courseTypes.forEach((type) => server.create('courseType', type));
      courses.forEach((course) => server.create('course', course));
      studentTypes.forEach((type) => server.create('studentType', type));
      studentCourses.forEach((course) => server.create('studentCourse', course));
      students.forEach((student) => server.create('student', student));
      studentProfile.forEach((student) => server.create('studentProfile', student));
    },

    routes() {
      this.passthrough((request) => {
        if (request.url === '/_next/static/development/_devPagesManifest.json') {
          return true;
        }
      });

      this.namespace = 'api';

      // for login function
      this.get(rootPath.login, (schema, request) => {
        let req = request.queryParams;
        console.log(req);
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
                token: Math.random().toString(32).split('.')[1] + '-' + req.loginType,
                loginType: req.loginType,
              },
              code: 200,
              msg: 'login success',
            }
          );
        } else {
          return new Response(403, {}, { msg: 'check user or email', code: 400 });
        }
      });

      //get Student List
      this.get(rootPath.students, (schema, request) => {
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

        students = students.map((student) => {
          // console.log(student);
          const studentCourses = student.studentCourse;

          let courses = [];
          if (studentCourses.length) {
            courses = studentCourses.models.map((model) => {
              const name = model.course.name;
              return { name, id: +model.id };
            });
          }

          student.attrs.courses = courses;
          student.attrs.typeName = student.type.name;
          return student;
        });

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
      });

      // add student in the student List
      this.post(`/${rootPath.students}/${subPath.add}`, (schema, request) => {
        let newStudentInfo = JSON.parse(request.requestBody);
        const { name, email, area, type } = newStudentInfo;
        const data = schema.students.create({
          name,
          email,
          area,
          typeId: type,
          ctime: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
        });

        data.attrs.typeName = data.type.name;

        return new Response(200, {}, { msg: 'success', code: 200, data });
      });

      //update student in the student List
      this.post(`/${rootPath.students}/${subPath.update}`, (schema, request) => {
        const { name, email, area, type, id } = JSON.parse(request.requestBody);
        const targetData = schema.students.findBy({ id });

        if (targetData) {
          const data = targetData.update({
            email,
            name,
            area,
            typeId: type,
            updateAt: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          });
          console.log(data);
          data.attrs.typeName = data.type.name;

          return new Response(200, {}, { msg: 'success', code: 200, data });
        } else {
          return new Response(400, {}, { msg: `can\'t find student by id ${id} `, code: 400 });
        }
      });

      //delete student in the student List
      this.delete(`/${rootPath.students}/${subPath.delete}`, (schema, request) => {
        let req = request.queryParams.id;
        const data = schema.students.find(req).destroy();

        return new Response(200, {}, { data: true, msg: 'success', code: 200 });
      });

      // get single student profile
      this.get(rootPath.student, (schema, request) => {
        const id = request.queryParams.id;
        const targetStudent = schema.studentProfiles.findBy({ id });
        const studentCourses = targetStudent.studentCourse;
        let courses = [];

        if (studentCourses.length) {
          courses = studentCourses.models.map((item) => {
            item.attrs.courseName = item.course.name;
            item.attrs.type = item.course.type.name;
            return item;
          });
        }

        targetStudent.attrs.courses = courses;
        targetStudent.attrs.typeName = targetStudent.type.name;

        if (targetStudent) {
          return new Response(200, {}, { data: targetStudent, msg: 'success', code: 200 });
        } else {
          return new Response(400, {}, { msg: `cannot find student by id ${id}`, code: 400 });
        }
      });

      // all courses
      this.get(rootPath.courses, (schema, request) => {
        let { limit, page } = request.queryParams;
        let allCourses = schema.courses.all().models;
        const total = allCourses.length;

        if (limit && page) {
          allCourses = allCourses.slice(limit * (page - 1), limit * page);
        }

        allCourses.forEach((item) => {
          item.attrs.teacherName = item.teacher.name;
          item.attrs.typeName = item.type.name;
        });

        if (allCourses) {
          return new Response(200, {}, { msg: 'success', code: 200, data: { total, allCourses } });
        } else {
          return new Response(500, {}, { msg: 'server error', code: 500 });
        }
      });

      //get single course detail
      this.get(rootPath.course, (schema, request) => {
        const id = request.queryParams.id;
        const targetCourse = schema.courses.findBy({ id });

        targetCourse.attrs.teacherName = targetCourse.teacher.name;
        targetCourse.attrs.schedule = targetCourse.schedule;
        targetCourse.attrs.sales = targetCourse.sales;
        targetCourse.attrs.typeName = targetCourse.type.name;

        if (targetCourse) {
          return new Response(200, {}, { data: targetCourse, msg: 'success', code: 200 });
        } else {
          return new Response(400, {}, { msg: `cannot find student by id ${id}`, code: 400 });
        }
      });

      this.post(rootPath.logout, (_, request) => {
        return new Response(200, {}, { data: true, msg: 'success', code: 200 });
      });
    },
  });

  return server;
}
