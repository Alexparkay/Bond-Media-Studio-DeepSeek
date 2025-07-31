import { TiUserAdd } from "react-icons/ti";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import BondLogo from "@/assets/logo-black.svg";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function InviteFriends() {

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            size="iconXs"
            variant="outline"
            className="!border-neutral-600 !text-neutral-400 !hover:!border-neutral-500 hover:!text-neutral-300"
          >
            <TiUserAdd className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg lg:!p-8 !rounded-3xl !bg-white !border-neutral-100">
          <DialogTitle className="hidden" />
          <main>
            <div className="flex items-center justify-center mb-5">
              <Image 
                src={BondLogo} 
                alt="Bond Media Logo" 
                width={120} 
                height={40}
                className="w-30 h-10"
              />
            </div>
            <p className="text-xl font-semibold text-neutral-950 max-w-[280px]">
              Explore Bond Media's Premium Websites
            </p>
            <p className="text-sm text-neutral-500 mt-2 max-w-sm">
              Discover our portfolio of custom, bespoke websites and professional web solutions.
            </p>
            <div className="mt-4">
              <a
                href="https://www.bondmedia.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="black"
                  size="lg"
                  className="w-full !text-base !h-11"
                >
                  <Image 
                    src={BondLogo} 
                    alt="Bond Media Logo" 
                    width={16} 
                    height={16}
                    className="w-4 h-4 mr-2 invert"
                  />
                  Visit Bond Media Website
                  <ExternalLink className="size-4 ml-2" />
                </Button>
              </a>
            </div>
          </main>
        </DialogContent>
      </form>
    </Dialog>
  );
}
