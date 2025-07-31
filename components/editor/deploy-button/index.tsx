/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdSave } from "react-icons/md";
import { Rocket } from "lucide-react";

import SpaceIcon from "@/assets/space.svg";
import BondLogo from "@/assets/Bond-Media-logo.svg";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { LoginModal } from "@/components/login-modal";
import { useUser } from "@/hooks/useUser";

export function DeployButton({
  html,
  prompts,
}: {
  html: string;
  prompts: string[];
}) {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [config, setConfig] = useState({
    title: "",
  });

  const createSpace = async () => {
    if (!config.title) {
      toast.error("Please enter a title for your project.");
      return;
    }
    
    // Demo mode - functionality disabled
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.info("Project deployment coming soon! This feature will be available in the full version.");
      setOpen(false);
    }, 2000);
    
    /* Original functionality disabled for demo
    try {
      const res = await api.post("/me/projects", {
        title: config.title,
        html,
        prompts,
      });
      if (res.data.ok) {
        router.push(`/projects/${res.data.path}?deploy=true`);
      } else {
        toast.error(res?.data?.error || "Failed to create project");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
    */
  };

  // TODO add a way to do not allow people to deploy if the html is broken.

  return (
    <div className="flex items-center justify-end gap-5">
      <div className="relative flex items-center justify-end">
        {user?.id ? (
          <Popover>
            <PopoverTrigger asChild>
              <div>
                <Button variant="default" className="max-lg:hidden !px-4">
                  <MdSave className="size-4" />
                  Deploy your Project
                </Button>
                <Button variant="default" size="sm" className="lg:hidden">
                  Deploy
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="!rounded-2xl !p-0 !bg-white !border-neutral-200 min-w-xs text-center overflow-hidden"
              align="end"
            >
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
                <p className="text-xl font-semibold text-neutral-950">
                  Deploy your Website!
                </p>
                <p className="text-sm text-neutral-500 mt-1.5">
                  Save and deploy your website project with Bond Media Studio.
                  Share your amazing website with the world.
                </p>
              </header>
              <main className="space-y-4 p-6">
                <div>
                  <p className="text-sm text-neutral-700 mb-2">
                    Choose a title for your website:
                  </p>
                  <Input
                    type="text"
                    placeholder="My Awesome Website"
                    value={config.title}
                    onChange={(e) =>
                      setConfig({ ...config, title: e.target.value })
                    }
                    className="!bg-white !border-neutral-300 !text-neutral-800 !placeholder:text-neutral-400 selection:!bg-blue-100"
                  />
                </div>
                <div>
                  <p className="text-sm text-neutral-700 mb-2">
                    Then, let&apos;s deploy it!
                  </p>
                  <Button
                    variant="black"
                    onClick={createSpace}
                    className="relative w-full"
                    disabled={loading}
                  >
                    Deploy Website <Rocket className="size-4" />
                    {loading && (
                      <Loading className="ml-2 size-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </main>
            </PopoverContent>
          </Popover>
        ) : (
          <>
            <Button
              variant="default"
              className="max-lg:hidden !px-4"
              onClick={() => setOpen(true)}
            >
              <MdSave className="size-4" />
              Save your Project
            </Button>
            <Button
              variant="default"
              size="sm"
              className="lg:hidden"
              onClick={() => setOpen(true)}
            >
              Save
            </Button>
          </>
        )}
        <LoginModal
          open={open}
          onClose={() => setOpen(false)}
          html={html}
          title="Log In to save your Project"
          description="Log In through Bond Media Studio to save your project and unlock additional features."
        />
      </div>
    </div>
  );
}
