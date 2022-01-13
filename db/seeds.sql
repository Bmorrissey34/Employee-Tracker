INSERT INTO department (department_name)
VALUES ('Sales'),
       ('Engineering'),
       ('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES ('Marketing Manager', 100000, 1),
       ('Sales Lead', 75000, 1),
       ('Front End Engineer', 150000, 2),
       ('Software Engineer', 120000, 2),
       ('Head of Accounting', 170000, 3),
       ('Accountant', 95000, 3);

INSERT INTO employee (first_name, role_id, manager_id)
VALUES ('Bob', 'Smith', 1, NULL),
       ('Joe', 'Howe', 2, 1),
       ('Jean', 'Smith', 3, NULL),
       ('Abby', 'Grant', 4, 3),
       ('Bob', 'Finley', 5, NULL),
       ('Dick', 'Clark', 6 , 5);