import { Server, Model } from "miragejs";

export  function makeServer({ environment = "development" } = {}){
    let users = require('./user.json');
    let students = require('./student.json');
    let server = new Server({
        environment,
        models: {
            users: Model,
            students: Model
        },
        seeds(server) {
            students.forEach((student) => {server.create('student',student)});
            users.forEach((user)=>{server.create('user',user)});
        },
        routes(){
            this.namespace = 'api'

            this.get('/login', (schema, request) => {
                // debugger;
                let email = request.queryParams.email;
                let password = request.queryParams.password;
                return schema.students.all().filter((item) => {if (item.email === email && item.password === password){return item}})
            },
            {timing: 1000}
            )
        },
    })

    return server;
}