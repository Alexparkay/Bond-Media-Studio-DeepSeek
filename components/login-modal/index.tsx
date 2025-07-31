import { useLocalStorage } from "react-use";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";
import { isTheSameHtml } from "@/lib/compare-html-diff";
import Image from "next/image";
import BondLogo from "@/assets/Bond-Media-logo.svg";

export const LoginModal = ({
  open,
  html,
  onClose,
  title = "Log In to use Bond Media Studio for free",
  description = "Log In through Bond Media Studio to continue creating amazing websites and unlock additional features.",
}: {
  open: boolean;
  html?: string;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
}) => {
  const { } = useUser();
  const [, setStorage] = useLocalStorage("html_content");
  const handleClick = async () => {
    if (html && !isTheSameHtml(html)) {
      setStorage(html);
    }
    // Login functionality disabled for demo
    // openLoginWindow();
    onClose(false);
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg lg:!p-8 !rounded-3xl !bg-white !border-neutral-100">
        <DialogTitle className="hidden" />
        <main className="flex flex-col items-start text-left relative pt-2">
          <div className="flex items-center justify-center mb-5">
            <Image 
              src={BondLogo} 
              alt="Bond Media Studio Logo" 
              width={120} 
              height={40}
              className="w-30 h-10"
            />
          </div>
          <p className="text-2xl font-bold text-neutral-950">{title}</p>
          <p className="text-neutral-500 text-base mt-2 max-w-sm">
            {description}
          </p>
          <Button
            variant="black"
            size="lg"
            className="w-full !text-base !h-11 mt-8"
            onClick={handleClick}
          >
            Log In to Continue
          </Button>
        </main>
      </DialogContent>
    </Dialog>
  );
};
