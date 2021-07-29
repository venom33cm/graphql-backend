const { buildSchema } = require("graphql");

module.exports = buildSchema(`

type AuthData{
    userId:ID!
    token:String!
    tokenExpiry:Int!
}

type Booking{
    _id:ID!
    event:Event!
    user:user!
    createdAt:String!
    updatedAt:String!
}

type Event{
    _id:ID!
    title:String!
    description:String!
    price:Float!
    date:String!
    creator:user!
}  


type user{
  _id:ID!
  email:String!
  password:String
  createdEvents:[Event!]
}


input UserInput{
  email:String!
  password:String!
}

input EventInput{
    title:String!
    description:String!
    price:Float!
    date:String!
}

type rootQuery{
    getEvent:[Event!]!
    getBookings:[Booking!]!
    login(email:String!,password:String!):AuthData!
}

type rootMutation{
    createEvent(eventInput:EventInput):Event!
    createUser(userInput:UserInput):user!
    BookEvent(eventId:ID!):Booking!
    cancelBooking(bookedId:ID!):Event!
}

schema{
    query:rootQuery
    mutation:rootMutation
}
    
`);
