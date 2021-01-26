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

token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
  .eyJlbWFpbCI6Im1hbmFnZXJAYWRtaW4uY29tIiwicm9sZSI6Im1hbmFnZXIiLCJpZCI6MywiaWF0IjoxNjExMzkyODk4LCJleHAiOjE2MTkxNjg4OTh9
  .oaY2QnpFUwjJKwCxb_dQv5KYqeRcSVZVuSOmbFblfq0;
