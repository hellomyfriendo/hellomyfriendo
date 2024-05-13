import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import {config} from "@/app/lib/config"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google({
    clientId: config.google.identity.oAuth2.clientID,
    clientSecret: config.google.identity.oAuth2.clientSecret
  })],
  secret: config.nextAuth.secret
})