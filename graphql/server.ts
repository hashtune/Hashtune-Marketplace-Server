import { ApolloServer } from 'apollo-server-express';
// import EthSigUtil from 'eth-sig-util';
import express from 'express';
import { createServer } from 'http';
import passport from 'passport';
import { createContext } from './context';
import { schema } from './schema';
var cors = require('cors');

const cookieParser = require('cookie-parser');

const { PORT = 5000 } = process.env;
const session = require('express-session');

const app = express();

// TODO move to separate file ./auth/passport.ts
// TODO use this passport middleware in mutations
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

const secret = process.env.SERVER_SECRET ?? '';

const JwtStrategy = require('passport-jwt').Strategy;
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: (req: any) => req.cookies['jwt'] ?? null,
      secretOrKey: secret,
    },
    async function (jwt_payload, done) {
      console.log({ jwt_payload });
      console.log('WEE');
      if (jwt_payload && jwt_payload.user) {
        return done(null, jwt_payload.user);
      } else {
        // user is false if they do not have a valid jwt
        return done(null, false);
      }
    }
  )
);

export const jwtRequired = passport.authenticate('jwt', { session: false });

app.post('/login', (req: any, res: any, next: any) => {
  passport.authenticate('jwt', async (err, user: any) => {
    console.log(req.query);
    const signedMessage = req.query.message;
    const publicKey = req.query.publicKey;

    if (user) {
      // already logged in then redirect to home
      //return next(user);
    }
    return res.json('signature and public key did not match');
  })(req, res, next);
});

app.get('/protected', jwtRequired, (req, res, next) => {
  console.log('approvied');
});

const server = createServer(app);

export const apollo = new ApolloServer({
  schema,
  introspection: true,
  apollo: {},
  context: createContext,
});

export async function main() {
  await apollo.start();
  apollo.applyMiddleware({ app });
  server.listen({ port: PORT }, () => {
    process.stdout.write(
      ` 🚀  Server ready at http://localhost:${PORT}${apollo.graphqlPath}`
    );
  });
}
process.env.STAGE != 'test' && main();
