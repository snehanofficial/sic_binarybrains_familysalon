"use client";

import HomePage from "../components/home/HomePage";
import { useRouter } from "next/navigation";

export default function HomeRoute() {
  const router = useRouter();

  return (
    <HomePage
      navigate={(p) => {
        if (p === "home") router.push("/");
        else router.push(`/${p}`);
      }}
      goToBooking={() => router.push("/booking")}
      setActiveCategory={(cat) => router.push(`/services?category=${cat}`)}
    />
  );
}
