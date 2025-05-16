"use client";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import React, { useEffect } from "react";

const supabase = createClient();

const Navbar = () => {
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user:", userError);
        return;
      }
      if (user) {
        const { data } = await supabase
          .from("Profiles")
          .select("profile_pic_path")
          .eq("id", user.id)
          .single();

        console.log("avatarUrl", data?.profile_pic_path);

        if (data?.profile_pic_path) {
          const { data: urlData } = await supabase.storage
            .from("avatars")
            .createSignedUrl(data.profile_pic_path, 300);

          console.log("urlData", urlData?.signedUrl);

          setAvatarUrl(urlData?.signedUrl ?? null);
        }
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <header className="sticky top-0 left-0 w-[90%]  mx-auto  flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="logo" width={30} height={30} />
        PrepWise
      </div>
      <div className="rounded-full  overflow-hidden h-[30px] w-[30px] ">
        <Image
          src={avatarUrl ?? "/default-avatar.png"}
          alt="logo"
          width={30}
          height={30}
          className="w-full h-full object-cover"
        />
      </div>
    </header>
  );
};

export default Navbar;
