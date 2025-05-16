"use client";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

const supabase = createClient();

const Navbar = () => {
  const [profilePicPath, setProfilePicPath] = React.useState<string | null>(
    null
  );
  const [fullName, setFullName] = React.useState<string | null>(null);

  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push("/login");
  };

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
          .select("profile_pic_path, full_name")
          .eq("id", user.id)
          .single();

        console.log("avatarUrl", data?.profile_pic_path);

        if (data?.full_name) {
          setFullName(data?.full_name);
        }

        if (data?.profile_pic_path) {
          setProfilePicPath(data?.profile_pic_path);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {profilePicPath ? (
              <Image
                src={`/api/avatar?path=${encodeURIComponent(
                  profilePicPath || ""
                )}`}
                alt="logo"
                width={30}
                height={30}
                className="w-full h-full object-cover cursor-pointer"
              />
            ) : (
              <Skeleton className="w-full h-full" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Log out
              {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
