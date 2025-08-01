import classNames from "classnames";
import { FaMobileAlt } from "react-icons/fa";
import { HelpCircle, RefreshCcw, SparkleIcon } from "lucide-react";
import { FaLaptopCode } from "react-icons/fa6";
import { HtmlHistory } from "@/types";
import { Button } from "@/components/ui/button";
import { MdAdd } from "react-icons/md";
import { History } from "@/components/editor/history";
import { UserMenu } from "@/components/user-menu";
import { useUser } from "@/hooks/useUser";
import { LoginModal } from "@/components/login-modal";
import { useState } from "react";

const DEVICES = [
  {
    name: "desktop",
    icon: FaLaptopCode,
  },
  {
    name: "mobile",
    icon: FaMobileAlt,
  },
];

export function Footer({
  onReset,
  htmlHistory,
  setHtml,
  device,
  setDevice,
  iframeRef,
}: {
  onReset: () => void;
  htmlHistory?: HtmlHistory[];
  device: "desktop" | "mobile";
  setHtml: (html: string) => void;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  setDevice: React.Dispatch<React.SetStateAction<"desktop" | "mobile">>;
}) {
  const { user } = useUser();
  const [showGalleryLogin, setShowGalleryLogin] = useState(false);
  const [showHelpLogin, setShowHelpLogin] = useState(false);

  const handleRefreshIframe = () => {
    if (iframeRef?.current) {
      const iframe = iframeRef.current;
      const content = iframe.srcdoc;
      iframe.srcdoc = "";
      setTimeout(() => {
        iframe.srcdoc = content;
      }, 10);
    }
  };

  return (
    <footer className="border-t bg-slate-200 border-slate-300 dark:bg-neutral-950 dark:border-neutral-800 px-3 py-2 flex items-center justify-between sticky bottom-0 z-20">
      <div className="flex items-center gap-2">
        {user &&
          (user?.isLocalUse ? (
            <>
              <div className="max-w-max bg-amber-500/10 rounded-full px-3 py-1 text-amber-500 border border-amber-500/20 text-sm font-semibold">
                Local Usage
              </div>
            </>
          ) : (
            <UserMenu className="!p-1 !pr-3 !h-auto" />
          ))}
        {user && <p className="text-neutral-700">|</p>}
        <Button size="sm" variant="secondary" onClick={onReset}>
          <MdAdd className="text-sm" />
          New <span className="max-lg:hidden">Project</span>
        </Button>
        {htmlHistory && htmlHistory.length > 0 && (
          <>
            <p className="text-neutral-700">|</p>
            <History history={htmlHistory} setHtml={setHtml} />
          </>
        )}
      </div>
      <div className="flex justify-end items-center gap-2.5">
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => setShowGalleryLogin(true)}
        >
          <SparkleIcon className="size-3.5" />
          <span className="max-lg:hidden">Bond Media Studio Gallery</span>
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setShowHelpLogin(true)}
        >
          <HelpCircle className="size-3.5" />
          <span className="max-lg:hidden">Help</span>
        </Button>
        <Button size="sm" variant="outline" onClick={handleRefreshIframe}>
          <RefreshCcw className="size-3.5" />
          <span className="max-lg:hidden">Refresh Preview</span>
        </Button>
        <div className="flex items-center rounded-full p-0.5 bg-neutral-700/70 relative overflow-hidden z-0 max-lg:hidden gap-0.5">
          <div
            className={classNames(
              "absolute left-0.5 top-0.5 rounded-full bg-white size-7 -z-[1] transition-all duration-200",
              {
                "translate-x-[calc(100%+2px)]": device === "mobile",
              }
            )}
          />
          {DEVICES.map((deviceItem) => (
            <button
              key={deviceItem.name}
              className={classNames(
                "rounded-full text-neutral-300 size-7 flex items-center justify-center cursor-pointer",
                {
                  "!text-black": device === deviceItem.name,
                  "hover:bg-neutral-800": device !== deviceItem.name,
                }
              )}
              onClick={() => setDevice(deviceItem.name as "desktop" | "mobile")}
            >
              <deviceItem.icon className="text-sm" />
            </button>
          ))}
        </div>
      </div>
      
      {/* Login Modals */}
      <LoginModal
        open={showGalleryLogin}
        onClose={setShowGalleryLogin}
        title="Log In to access Bond Media Studio Gallery"
        description="Log In through Bond Media Studio to browse our gallery of amazing website templates and examples."
      />
      <LoginModal
        open={showHelpLogin}
        onClose={setShowHelpLogin}
        title="Log In to get Help"
        description="Log In through Bond Media Studio to access our help center and support resources."
      />
    </footer>
  );
}
