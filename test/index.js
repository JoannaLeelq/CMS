const RoutePath = {
  manager: 'manager',
  teachers: 'teachers',
  students: 'students',
  selectStudents: 'selectStudents',
  courses: 'courses',
  add: 'add',
  edit: 'edit',
};

const students = {
  path: [],
  label: 'Students',
  subNav: [
    { path: [RoutePath.students], label: 'Student List' },
    {
      path: [RoutePath.selectStudents],
      label: 'Select Students',
      subNav: [{ path: ['aa'], label: 'Test' }],
    },
  ],
};

const courses = {
  path: [],
  label: 'Courses',
  subNav: [
    { path: [RoutePath.courses], label: 'All Courses' },
    { path: [RoutePath.add], label: 'Add' },
  ],
};

const teachers = {
  path: [],
  label: 'Teachers',
  subNav: [
    {
      path: [RoutePath.teachers],
      label: 'Teacher List',
      subNav: [{ path: ['bb'], label: 'Test' }],
    },
  ],
};

const overview = {
  path: [],
  label: 'Overview',
};

const routes = {
  manager: [overview, students, teachers, courses],
  teachers: [overview, students, courses],
  students: [overview, courses],
};

const generateFactory = () =>
  function inner(data, current = '') {
    // console.log(data);
    const keys = data.map((item, index) => {
      let key = `${item.label}_${index}`;

      if (current) {
        key = [current, key].join('/');
      }

      if (item.subNav && !!item.subNav.length) {
        return inner(item.subNav, key).map((item) => item.join('/'));
      } else {
        return [key];
      }
    });

    return keys;
  };

const x = generateFactory();
const keys = x(routes.manager);
console.log(keys);
