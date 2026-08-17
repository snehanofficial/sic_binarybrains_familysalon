"use client";

import GalleryPage from "../../components/gallery/GalleryPage";
import { useRouter } from "next/navigation";

export default function GalleryRoute() {
  const router = useRouter();

  return (
    <GalleryPage
      goToBooking={() => router.push("/booking")}
      navigate={(p) => {
        if (p === "home") router.push("/");
        else router.push(`/${p}`);
      }}
    />
  );
}
