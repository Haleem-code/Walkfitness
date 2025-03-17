"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { APP_URL } from "@/config";

const AuthPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      console.log(session);
      router.push("/walk");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        backgroundImage: "url(/images/authpage.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div>
        <figure>
          <Image
            src="/images/logo.svg"
            alt="Logo"
            className="h-10"
            style={{ marginTop: "-10rem" }}
            width={100}
            height={40}
          />
        </figure>
      </div>
      <div
        className="signin-container border p-4 mb-4"
        style={{
          borderColor: "#CEFF67",
          height: "14rem",
          width: "22rem",
          borderWidth: "3px",
          borderStyle: "double",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p
          className="text-center"
          style={{ fontSize: "12px", marginBottom: "2rem", color: "#fff" }}
        >
          We will sync your profile across your Telegram ID
        </p>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          type="button"
          className="bg-black text-white px-4 py-2 mb-4 border border-white"
          style={{
            borderWidth: "3px",
            borderStyle: "double",
            marginBottom: "1rem",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            transition: "box-shadow 0.3s ease-in-out",
          }}
          onClick={() => signIn("google", { callbackUrl: "/walk" })}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 15px white")
          }
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          <Image
            src="/images/google.svg"
            alt="google"
            width={150}
            height={150}
          />
        </button>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          type="button"
          className="bg-black text-white px-5 py-4 border border-white mb-2"
          style={{
            borderWidth: "3px",
            borderStyle: "double",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            transition: "box-shadow 0.3s ease-in-out",
          }}
          onClick={() => signIn("fitbit", { callbackUrl: "/walk" })}
          onMouseEnter={(e) =>
            (e.currentTarget.style.boxShadow = "0 0 15px white")
          }
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
        >
          <Image
            src="/images/fitbit.svg"
            alt="fitbit"
            width={150}
            height={150}
          />
        </button>
      </div>
      {status === "unauthenticated" && (
        <p className="text-center" style={{ fontSize: "12px", color: "red" }}>
          Not authenticated
        </p>
      )}
      <p className="text-center" style={{ fontSize: "12px" }}>
        By signing up you agree to
        <a
          href="#"
          style={{ color: "#CEFF67", cursor: "pointer", marginLeft: "5px" }}
        >
          Terms of Service
        </a>
        and
        <a
          href="/privacy"
          style={{ color: "#CEFF67", cursor: "pointer", marginLeft: "5px" }}
        >
          Privacy
        </a>
      </p>
    </div>
  );
};

export default AuthPage;
