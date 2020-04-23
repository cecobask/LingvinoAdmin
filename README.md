# lingvino-admin
The web application works closely and manages the data of Lingvino Android application. Application
administrators are not developers, nor they are users. However, their work is critical to keeping an
application running. A mobile application like Lingvino needs frequent database updates such as
adding new topics with questions (or just individual questions to an existing topic), fixing a typo in an
example sentence of Word of the Day, manually importing data to a user’s collection of translations
on their request, disabling and/or deleting a user’s account and updating their password. To facilitate
this process for someone that might not be tech-savvy, an administrative web application is needed.  

*Objectives*:
- Adhered to design Material Design guidelines (Material Design Guidelines, n.d.) and made sure
the user interface resembles the Android application’s design.
- Connected the web application to the existing Firebase project that the Android application is
using. This provides seamless integration of the application data.
- Set up fully validated authentication with Firebase (email + password). Only give access to the
admin users.
- Incorporated a navigation drawer to facilitate navigation between control panels.
- Created individual control panel for each main feature of the Android application that presents
their data in a Tree view format (parent node -> child node -> child of the child node -> so on).
- Each control panel enables quick searching for specific data records.
- The data records are easy to manage (editing or deleting). For this purpose, every data
record in the tree view has a context menu that lists the possible actions.
- Possible to select multiple data records for multi-delete action.
- Data records can be edited in two ways:
    - Complex objects have an option button that brings up a JavaScript Object Notation
(JSON) editor, that presents the data in a more readable format.
    - Simple objects can be edited in an automatically generated form with all their
attributes and corresponding values listed and ready to update.
- The “Add new records” button must implement different actions, depending on the control
panel context.
    - Word of the day control panel allows admins to enter new words that will be
inserted into the WordOfTheDay database collection.
    - Quiz Game control panel allows admins to pick what data type they would like to
insert to the database. There are two possible types - individual questions for existing
topic or new topic with a set of questions included. This action brings up a JSON editor
that validates the input before it is submitted.
- The User Management control panel provides admins with ability to update/reset
account passwords, disable/enable, delete and create new user accounts in an easy to use
manner.

## Project setup
###Install dependencies
```
npm install
```
### Compiles and hot-reloads for development
```
npm run serve
```
### Compiles and minifies for production
```
npm run build
```
### Lints and fixes files
```
npm run lint
```

## External dependencies
- eslint
- firebase (database, auth, functions)
- vuetify
- vuex
- vue-json-edit
- vue-loading-overlay
- v-jsoneditor
