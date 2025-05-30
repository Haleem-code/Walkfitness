import NextAuth from "next-auth";
import "dotenv/config";
import { connectToDb } from "./utils";
import { User, Steps, Point, Game} from "./models";
import { updateStepData } from "./updateSteps";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    {
      id: "fitbit",
      name: "Fitbit",
      type: "oauth",
      clientId: process.env.FITBIT_ID,
      clientSecret: process.env.FITBIT_SECRET,
      authorization: {
        url: "https://www.fitbit.com/oauth2/authorize",
        params: {
          scope: "activity profile social",
          response_type: "code",
        },
      },
      token: {
        url: "https://api.fitbit.com/oauth2/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.FITBIT_ID}:${process.env.FITBIT_SECRET}`
          ).toString("base64")}`,
        },
      },
      userinfo: {
        url: "https://api.fitbit.com/1/user/-/profile.json",
        async request({ tokens, provider }) {
          const response = await fetch(provider.userinfo.url, {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
            },
          });
          return await response.json();
        },
      },
      profile(profile) {
        console.log("Fitbit Profile:", profile);
        return {
          id: profile.user.encodedId,
          name: profile.user.displayName,
          email: profile.user.encodedId,
          image: profile.user.avatar || null,
        };
      },
    },
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.userId = account.providerAccountId || user?.id;
        
        // Only connect to DB if we have a userId
        if (token.userId) {
          try {
            await connectToDb();
            
            // Initialize user in database
            let existingUser = await User.findOne({ email: token.userId });
            if (!existingUser) {
              existingUser = new User({
                username: user?.name || "Fitbit User",
                email: token.userId,
                image: user?.image,
                googleAccessToken: account.access_token,
                totalSteps: 0,
                firstStepDate: new Date(),
                lastStepUpdate: new Date(),
                stepsForLastUpdate: 0,
              });
              await existingUser.save();
            } else {
              existingUser.googleAccessToken = account.access_token;
              await existingUser.save();
            }
            
            // Initialize points
            let pointEntry = await Point.findOne({ email: token.userId });
            if (!pointEntry) {
              pointEntry = new Point({
                email: token.userId,
                questPoint: 0,
                totalPoint: 0,
              });
              await pointEntry.save();
            }
    
            // Fetch step data
            if (account.access_token) {
              await updateStepData(token.userId, account.access_token);
            }
          } catch (err) {
            console.error("Database error:", err);
          }
        }
      }
      return token;
    },
    
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.userId = token.userId;
      console.log("Session:", session);
      return session;
    },
  },
  
  // Add debug mode
  debug: true,
  
  // Session configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Pages configuration
  pages: {
    signIn: "/authpage",
    error: "/authpage",
  },
});

