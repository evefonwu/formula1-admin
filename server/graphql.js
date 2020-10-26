require("dotenv").config();

const { ApolloServer, gql } = require("apollo-server");

const {
  createRace,
  races,
  activeDrivers,
  raceInfoOf,
  updateRaceResultFor,
} = require("./resolvers/database");

const typeDefs = gql`
  type Query {
    info: String!
    races: [Race]
    activeDrivers: [Driver]
    raceInfoOf(raceid: Int!): RaceInfo
  }

  type Mutation {
    createRace(input: RaceInput!): Race!
    updateRaceResultFor(
      raceid: Int!
      driverid: Int!
      input: ResultInput!
    ): Result!
  }

  type RaceInfo {
    raceid: Int!
    name: String!
    round: Int!
    year: Int!
    datetime: String!
    drivers: [Participant]
  }

  type Participant {
    driverid: Int!
    fullname: String!
    laps: Int
    time: String
  }

  type Driver {
    driverid: Int!
    fullname: String!
  }

  type Race {
    raceid: Int!
    name: String!
    round: Int!
    year: Int!
    datetime: String!
  }

  input RaceInput {
    name: String!
    round: Int!
    year: Int!
    datetime: String!
    driveridlist: [Int]!
  }

  type Result {
    resultid: Int!
    raceid: Int!
    driverid: Int!
    laps: Int
    time: String
  }

  input ResultInput {
    laps: Int
    time: String
  }
`;

const resolvers = {
  Query: {
    info: () => `Formula1 Admin API`,
    races,
    activeDrivers,
    raceInfoOf,
  },
  Mutation: {
    createRace,
    updateRaceResultFor,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Database username: ${process.env.USERNAME}`);
  console.log(`Server running at ${url}`);
});
