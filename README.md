# About the project

Welcome to my _**E-Banking Application**_ project! This project is designed to be a simple web application which contains regular banking operations for its users. My main focus during the development of the project is to keep the application compact, functional, easily usable, and before all, since it is a banking app, reliable.

During my time working on this project, I had the opportunity to learn a lot about software development process. I followed a simplified version of Larman's software development methodology, which consists of five key stages:

- Requirements definition stage
- Analysis stage
- Design stage
- Implementation stage
- Test stage

Project is located inside _projekat_ folder, where you can find _frontend_ and _backend_ code, and also database schema copy-paste code.

_**Full documentation**_ featuring this project is located inside that folder, in Serbian language.

## Requirements Definition Stage

In the initial phase of development, I have identified two actors who interact with the system, namely the student, the admin and the manager. I have identified 11 requirements in total for these actors:

_User requirements:_

![User requests](/projekat/images/requests%20user1.drawio.png)

_Admin requests:_

![Admin requests](/projekat/images/requests%20admin.drawio.png)

_Manager requests:_

![Manager requests](/projekat/images/requests%20manager.drawio.png)

## Analysis Stage

During the analysis phase, I focused on understanding the dynamics of the system. I have realized that the main actor of this system has to be a regular user.

In the **_full project documentation_** I have covered every Actor Use Case using UML System Sequence Diagrams. I also created a _Conceptual Model_ using a _UML Class Diagram_, to represent the structure / the attributes of the system:

![Conceptual model](/projekat/images/konceptualni%20model.png)

From the _Conceptual Model_, I derived the _Relational Model_ for the database:

```
User( #id, name, email, password, date_of_birth, gender, work_status, street, city, country, postal_code, phone_number, role)

Account( #id, account_number, currency, balance, balance_in_usd, is_active, user_id)

Transaction(#id, amount_in_domain, amount, status, recipient_name, recipient_account, transaction_number, currency_domain, currency, account_id)

Card(#id, card_number, expiry_date, cvv, card_type, payment_type, account_id )

Admin(#id, email, password, role)

Manager (#id, email, password, role)

UserAdmin ( #idUser, #idAdmin )

AdminManager ( #idAdmin, #idManager)
```

## Design Stage

At this phase, I designed web pages and components for each use case. Here are some _examples_ of the forms I created.

_Admin view of the user profile page:_

![User profile page - admin view](/projekat/images/admin%20user%20profile%20page%201.png)

_User's transactions page:_

![User transactions page](/projekat/images/user%20transactions%20page.png)

_User's cards page:_

![User cards page](/projekat/images/user%20cards%20page.png)

The design is focused on simplicity, consistency and responsiveness to ensure a great user experience.

## Implementation Stage

The application was built following MVC pattern principles, using these technologies:

- **Frontend:** React, JavaScript, Axios, React Router, PrimeReact for tabular view, Chart.js for data visualization

- **Backend:** Laravel, PHP, MySQL (using XAMPP tools), Laravel Sanctum

- **Other tools:** Git for version control, Postman for API testing

## Testing Stage

The application was tested to ensure functionality and security. Individual components, pages, functionalities and security mechanisms have been tested and assured.

## Run locally

Clone the project

1. **Clone the repository**

```
git clone https://github.com/elab-development/internet-tehnologije-2024-projekat-prvidomaci_2021_0126
```

2. **Set up the backend**

- Navigate to the _backend_ folder
- Configure the **.env file** with your database credentials
- Run migrations using the command: _php artisan migrate:fresh --seed_

OR

- Use database schema located inside _projekat_ folder, within tinker (feel free to change it according to your preferences)
- Start the development server: _php artisan serve_

3. **Set up the frontend**

- Navigate to the _frontend_ folder.
- Start the development server: _npm start_.
