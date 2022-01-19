const cTable = require("console.table")
const fs = require('fs')
const inquirer = require("inquirer")
const mysql = require("mysql2")

// makes connection roles_db

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'roles_db'
  },
  console.log(`Connected to the roles_db database.`)
)

let startPrompt = () => {
  inquirer.prompt({
      type: 'list',
      message: 'What would you like to do?',
      name: 'next',
      choices: ['View all departments', 'View all roles', "View all employees", 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Im Finished']
    })

    .then((response) => {

      switch (response.next) {
        case 'View all departments':
          viewDepartments()
          break
        case 'View all roles':
          viewRoles()
          break
        case 'View all employees':
          viewEmployees()
          break
        case 'Add a department':
          addDepartment()
          break
        case 'Add a role':
          addRole()
          break
        case 'Add an employee':
          addEmployee()
          break
        case 'Update an employee role':
          updateRole()
          break
        default:
          done()
          break
      }
    })
}

startPrompt()


// view departments
const viewDepartments = () => {
  db.query('SELECT * FROM department', function (err, results) {
    console.table(results)
  })
  startPrompt()
}

const viewRoles = () => {
  db.query('SELECT * FROM roles', (err, results) => {
    console.table(results)
  })
  startPrompt()
}

const viewEmployees = () => {
  db.query('SELECT * FROM employee', (err, results) => {
    console.table(results)
  })
  startPrompt()
}

const addRole = () => {
  db.query(`SELECT * FROM department`, function (err, results) {
    let allDepartments = results.map(department => {
      return {
        value: department.id,
        name: department.department_name
      }
    })
    inquirer.prompt([

        {
          type: 'input',
          message: 'What role would you like to add?',
          name: 'newRoleName',
        },
        {
          type: 'input',
          message: 'What is the salary of this role?',
          name: 'newRoleSalary',
        },
        {
          type: 'list',
          message: 'Choose a department for the employee',
          name: 'newRoleDeptID',
          choices: allDepartments
        }

      ])

      .then(({
        newRoleName,
        newRoleSalary,
        newRoleDeptID
      }) => {
        console.log(newRoleDeptID)
        db.query(`INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)`, [newRoleName, newRoleSalary, newRoleDeptID], function (err, results) {

        })

        db.query(`SELECT * FROM role`, function (err, results) {
          console.log('------------------------------------')
          console.log(`${newRoleName} has been added to the role table!`)
          console.log('------------------------------------')
          console.table(results)
        })
        startPrompt()
      })
  })
}

const addEmployee = () => {
  db.query('SELECT * FROM roles', (err, results) => {
      let allRoles = results.map(roles => {
          return {value: roles.id, name: roles.title}
      })
  db.query('SELECT * FROM employee', (err, results) => {
      let allEmployees = results.map(employee => {
          return {value: employee.id, name: employee.first_name}
      })
      inquirer.prompt([{
          type: 'input',
          message: 'What is the employees name?',
          name: 'firstName'
      }, {
          type: 'input',
          message: 'What is the employees last name?',
          name: 'lastName'
      }, {
          type: 'list',
          message: 'What role is the employee under?',
          name: 'employeesRole',
          choices: allRoles
      }, {
          type: 'list',
          message: 'What manager is the employee under?',
          name: 'employeesManager',
          choices: allEmployees
      }])
      .then(({firstName, lastName, employeesRole, employeesManager}) => {
          db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)', [firstName, lastName, employeesRole, employeesManager], (err, results) => {
          viewEmployees()
          })
      })
  })
})
}

const updateRole = () => {
  db.query(`SELECT * FROM roles`, (err, results) => {
    let allRoles = results.map(roles => {
      return {
        value: roles.id,
        name: roles.title
      }
    })
    db.query('SELECT * FROM employee', (err, results) => {

      let allEmployees = results.map(employee => {
        return {
          value: employee.id,
          name: employee.first_name
        }
      })
      inquirer.prompt([{
            type: 'list',
            message: "What is the first name of the employee you would like to update?",
            name: 'updateEmployee',
            choices: allEmployees
          },
          {
            type: 'list',
            message: "What is the employees new role?",
            name: 'newRole',
            choices: allRoles
          }
        ])
        .then(({
          updateEmployee,
          newRole
        }) => {
          db.query(`UPDATE employee SET role_id = ? WHERE first_name = ?`, [updateEmployee, newRole], (err, results) => {
            viewEmployees()
          })
        })
    })
  })
}

const addDepartment = (newDept) => {
  inquirer.prompt({
      type: 'input',
      message: 'What department would you like to add?',
      name: 'newDept'
    })
    .then((response) => {
      db.query('INSERT INTO department (department_name) VALUES(?)', response.newDept, function (err, results) {
        console.table(results)
        db.query(`SELECT * FROM department`, function (err, results) {
          console.table(results)
          console.log('------------------------------------')
          console.log(`${response.newDept} has been added to departments`)
          console.log('------------------------------------')
        })
        startPrompt()
      })
    })
}

const done = () => process.exit()