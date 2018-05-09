# CoopCalendar

## Introduction
CoopCalendar is an agenda-management and team-collaboration web calendar based on React.js ( front-end ), Node.js ( back-end ) and MongoDB ( database ). 

## Commands
1. Put file **env.json** into folder **/config**  

2. Install dependencies  
    `npm install`

3. Start server  
    `npm start`

## Team Roles

> Hao Tian

- Duty: login module 

> Jing Fu

- Duty: server services, mongoDB

>  Hongbin Li

- Duty: UI&UX design, react / html / css

## Functions

#### 1. Main Page

* Browse events in main page
* Paginate by month
* Back to today
* Current user status(login or logout)

#### 2. Event Management

* Add Event 
  - Add event by the top navigation or each day cell 
  - Event has the attributes of title/startDate/endDate/location/visibility(public or private)/note
  - public events are explicitly to everyone who has logined in
  - private events only show to the user who created them
* Edit Event 
  - Private event can only be edited by the creator   
  - Public event can be edited by anyone
* Delete Event 
  - Event can only be deleted by the creator 
* Show Event
  - Users can see public events and their own(private) events in the main page

#### 3. Register & Login

- Register by username and password
- Login with username and password
- Login by  Google oAuth 

#### 4. Security

* Add whitelisting input check for password ( letter & number, at least 6 digits)
* Add input validation
* Server do not trust client data
* Encrypt passwords before they are stored in database
* Client can only get the username and userID from backend
* Use xss-filter to prevent XSS attacks
* Add xss-filter to every input from client

#### 5. Future Plan

* Search date and events
* Remind upcoming events in several days
* User Management (edit profile)

## Data

- Use Mongo db to achieve data persistance 
- Deploy mongo DB at mLab.com
#### User

    {
        "userId" :
        "userName" :
        "password" :
        "events" :
    }

#### Event

    {
        "eventId" :
        "title" :
        "description" :
        "startDate" :
        "endDate" :
        "creater" :
        "visibility":
        "location" : 
    }
#### SESSION

    {
        "sessionId" :
        "session":{
            "cookie":{
                "originalMaxAge":
                "expires":
                "secure":
                "httpOnly":
            }
            "loginUser":{
                "id":
                "username":
            }
            "passport":{
                "user":
            }
        }
    }

### Deployment:
* Platform: Heroku
* Link:  


