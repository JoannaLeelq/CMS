const Role = {
  student: 'students',
  teacher: 'teacher',
  manager: 'manager',
};

const item = 'students';

[Role.student, Role.manager, Role.teacher].find((role) => role === item)
  ? console.log('find role')
  : console.log('not find role');
// console.log(result);
