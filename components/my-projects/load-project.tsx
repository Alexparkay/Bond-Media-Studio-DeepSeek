"use client";
import { useState } from "react";
import { Import } from "lucide-react";
import Image from "next/image";
import BondLogo from "@/assets/Bond-Media-logo.svg";

import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loading from "@/components/loading";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { LoginModal } from "../login-modal";

export const LoadProject = ({
  fullXsBtn = false,
}: {
  fullXsBtn?: boolean;
  onSuccess: (project: Project) => void;
}) => {
  const { user } = useUser();

  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const checkIfUrlIsValid = (url: string) => {
    // should match a Bond Media Studio project URL like: https://bondmediastudio.com/projects/username/project
    const urlPattern = new RegExp(
      /^(https?:\/\/)?(bondmediastudio\.com)\/projects\/([\w-]+)\/([\w-]+)$/,
      "i"
    );
    return urlPattern.test(url);
  };

  const handleClick = async () => {
    if (isLoading) return; // Prevent multiple clicks while loading
    if (!url) {
      toast.error("Please enter a URL.");
      return;
    }
    if (!checkIfUrlIsValid(url)) {
      toast.error("Please enter a valid Bond Media Studio project URL.");
      return;
    }

    // Demo mode - functionality disabled
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.info("Project import coming soon! This feature will be available in the full version.");
      setOpen(false);
      setUrl("");
    }, 2000);

    /* Original functionality disabled for demo
    const [username, namespace] = url
      .replace("https://bondmediastudio.com/projects/", "")
      .replace("https://bondmediastudio.com/projects/", "")
      .split("/");

    setIsLoading(true);
    try {
      const response = await api.post(`/me/projects/${username}/${namespace}`);
      toast.success("Project imported successfully!");
      setOpen(false);
      setUrl("");
      onSuccess(response.data.project);
    } catch (error: any) {
      if (error?.response?.data?.redirect) {
        return router.push(error.response.data.redirect);
      }
      toast.error(
        error?.response?.data?.error ?? "Failed to import the project."
      );
    } finally {
      setIsLoading(false);
    }
    */
  };

  return (
    <>
      {!user ? (
        <>
          <Button
            variant="outline"
            className="max-lg:hidden"
            onClick={() => setOpenLoginModal(true)}
          >
            <Import className="size-4 mr-1.5" />
            Load existing Project
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setOpenLoginModal(true)}
          >
            {fullXsBtn && <Import className="size-3.5 mr-1" />}
            Load
            {fullXsBtn && " existing Project"}
          </Button>
          <LoginModal
            open={openLoginModal}
            onClose={setOpenLoginModal}
            title="Log In to load your Project"
            description="Log In through Bond Media Studio to load an existing project and unlock additional features!"
          />
        </>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div>
              <Button variant="outline" className="max-lg:hidden">
                <Import className="size-4 mr-1.5" />
                Load existing Project
              </Button>
              <Button variant="outline" size="sm" className="lg:hidden">
                {fullXsBtn && <Import className="size-3.5 mr-1" />}
                Load
                {fullXsBtn && " existing Project"}
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md !p-0 !rounded-3xl !bg-white !border-neutral-100 overflow-hidden text-center">
            <DialogTitle className="hidden" />
            <header className="bg-neutral-50 p-6 border-b border-neutral-200/60">
              <div className="flex items-center justify-center mb-3">
                <Image 
                  src={BondLogo} 
                  alt="Bond Media Studio Logo" 
                  width={120} 
                  height={40}
                  className="w-30 h-10"
                />
              </div>
              <p className="text-2xl font-semibold text-neutral-950">
                Import a Project
              </p>
              <p className="text-base text-neutral-500 mt-1.5">
                Enter the URL of your Bond Media Studio project to import an existing
                website.
              </p>
            </header>
            <main className="space-y-4 px-9 pb-9 pt-2">
              <div>
                <p className="text-sm text-neutral-700 mb-2">
                  Enter your Bond Media Studio Project
                </p>
                <Input
                  type="text"
                  placeholder="https://bondmediastudio.com/projects/username/project"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onBlur={(e) => {
                    const inputUrl = e.target.value.trim();
                    if (!inputUrl) {
                      setUrl("");
                      return;
                    }
                    if (!checkIfUrlIsValid(inputUrl)) {
                      toast.error("Please enter a valid URL.");
                      return;
                    }
                    setUrl(inputUrl);
                  }}
                  className="!bg-white !border-neutral-300 !text-neutral-800 !placeholder:text-neutral-400 selection:!bg-blue-100"
                />
              </div>
              <div>
                <p className="text-sm text-neutral-700 mb-2">
                  Then, let&apos;s import it!
                </p>
                <Button
                  variant="black"
                  onClick={handleClick}
                  className="relative w-full"
                >
                  {isLoading ? (
                    <>
                      <Loading
                        overlay={false}
                        className="ml-2 size-4 animate-spin"
                      />
                      Fetching your Project...
                    </>
                  ) : (
                    <>Import your Project</>
                  )}
                </Button>
              </div>
            </main>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
