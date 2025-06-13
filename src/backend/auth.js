import NextAuth from "next-auth";
import "dotenv/config";
import { connectToDb, generateWalletAddress } from "./utils";
import { User, Point, Game } from "./models";
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
      if (account?.provider === "fitbit") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.userId = account.user_id || account.providerAccountId;
        console.log(user, "User ID from account:", token.userId);
        console.log(token, "JWT Token:", token);
        console.log("Account:", account);
        // Only connect to DB if we have a userId
        if (token.userId) {
          try {
            await connectToDb();

            // Initialize user in database
            let existingUser = await User.findOne({ email: token.userId.toLowerCase() });
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

            if (account.access_token) {
              console.log("Fetching account data for user:", account.access_token);
              console.log("User ID:", account.user_id);
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

    async signOut({ token }) {
      
      try {
        if (token?.userId) {
          await connectToDb();
          // Optionally remove access token from database
          await User.findOneAndUpdate(
            { email: token.userId },
            { $unset: { googleAccessToken: 1 } }
          );
        }
      } catch (err) {
        console.error("Error during signout:", err);
      }
      return true;
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
    signOut: "/authpage",
  },
});

