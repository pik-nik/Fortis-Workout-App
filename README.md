# Project #2: Building Your First Full-stack Application

As part of GA Software Engineering Immersive course, I have made a workout app :muscle: for my second project.

The criteria was to make a password-protected, full-stack CRUD application that stores data in PostgreSQL in a little over 3 days.

Check it out here: https://fortis.onrender.com/

Please note that the website is currently not responsive for mobile and tablets. This is a work in process for the next version.

![Picture of my homepage](/public/images/homepage.png)

## Features

Fortis is latin for "strong". My app encourages users to post their workouts and share it with the community.

When logging workouts, users can add/edit/delete exercises, sets, reps and weights.
![Add an exercise](/public/gifs/addexercise.gif)

When creating or editing users, the database will be checked if a username or email already exists and passwords are checked to ensure they match. If not, the user will be redirected to the form and flash messages will appear.
![passwords do not match](/public/gifs/flash_messages.gif)

To speed up sign up process, a default profile picture is given to all new users. Users can later update their picture through "edit profile" on their profile page or settings.
![new user](/public/gifs/create_user.gif)

Whilst buttons to add, edit and delete are shown on user's own workout details page and profile page these buttons do not appear if a user goes to another user's workouts. The edit pages have also been safeguarded such that only the user who made the workout can access it.
![safeguarded links and buttons](/public/gifs/safeguarded.gif)

## Technologies used

JavaScript, Node.js, Postgres, Express, EJS, CSS

# Inspiration

I was talking to my lifting coach about how she couldn't find a great app that logged workouts. The one we were currently using was full of many bugs so I thought I would dabble in making my own.

# :thinking: Planning

It didn't take long in the planning process for me to realise the capacity of what I wanted to make in a bit over 3 days...

## Schema Tables

https://whimsical.com/schema-tables-7GaP9mejisBZZMi44Y4iNH#

During class codealongs we had only worked with ideas that required 2 tables – one representing someone using your application (users), and one that stored whatever was the intended purpose of the app. As I began to draw out my ERD, I started adding more and more tables to the mix.

I would need separate tables to order my workouts, exercises and sets of reps and weights. A workout contained many exercises and an exercise can belong to many workouts. Because of this relationship, I used a junction table to create a relationship between workouts and exercises.

From the schema tables I made during planning, I decided to narrow down the tables I implemented in my code due to the time constraints of the project.The tables in blue were the ones I went ahead with and the ones in red were the ones I excluded but will endeavour to add in future versions.

![Screenshot of my Schema ERD](/public/images/Schema%20example.png)

## Wireframe

Drawing up my wireframe made it easy for me lay out how each page would look. I chose to have a consistent form css styling which a lot of the pages had.
![Picture of my wireframes](/public/images/wireframes.jpg)

# v 1.0.0

-   This is the first version and what I submitted as part of my second project for General Assembly Software Engineering Immersive.

# Future features

Here is a list of future features I would like to add:

1. Make the app responsive to phones and websites
2. Allow the option to copy workouts. In order to do this I will need to add a user log table which is a log of workouts. This will allow a user to do a workout that they did not originally create.
3. Add more tables including exercise type, equipment used, workout type which will allow more search options for people to find workout or users for specific training styles e.g. powerlifting or bodybuilding.
4. Allow the choice to make the workout private, only accessible to coach or "friends" or public.
5. Allow coaches to post workouts for their clients to do.

# Dependencies used

-   bcrypt https://github.com/kelektiv/node.bcrypt.js/
-   cloudinary https://www.npmjs.com/package/cloudinary
-   dotenv https://www.npmjs.com/package/dotenv
-   EJS https://ejs.co/
-   Express https://expressjs.com/
-   express ejs layouts https://github.com/soarez/express-ejs-layouts
-   express-flash https://www.npmjs.com/package/express-flash
-   express-session https://www.npmjs.com/package/express-session
-   memorystore https://github.com/roccomuso/memorystore
-   method-override https://www.npmjs.com/package/method-override
-   nodemon https://www.npmjs.com/package/nodemon
-   pg https://node-postgres.com/
-   Ionicons https://ionic.io/ionicons
