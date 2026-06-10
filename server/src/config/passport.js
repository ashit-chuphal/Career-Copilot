import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              firstName: profile.name.givenName || "",
              lastName: profile.name.familyName || "",
              provider: "google",
              googleId: profile.id,
              profilePic: profile.photos?.[0]?.value || "",
            },
          });
        }
        console.log("GOOGLE STRATEGY START");
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;