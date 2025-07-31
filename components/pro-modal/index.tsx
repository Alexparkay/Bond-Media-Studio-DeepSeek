import { useLocalStorage } from "react-use";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CheckCheck } from "lucide-react";
import { isTheSameHtml } from "@/lib/compare-html-diff";
import { toast } from "sonner";
import Image from "next/image";
import BondLogo from "@/assets/Bond-Media-logo.svg";

export const ProModal = ({
  open,
  html,
  onClose,
}: {
  open: boolean;
  html: string;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [, setStorage] = useLocalStorage("html_content");
  const handleProClick = () => {
    if (!isTheSameHtml(html)) {
      setStorage(html);
    }
    // Demo mode - subscription functionality disabled
    // window.open("https://huggingface.co/subscribe/pro?from=DeepSite", "_blank");
    toast.info("Subscription coming soon! This feature will be available in the full version.");
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
          <h2 className="text-2xl font-bold text-neutral-950">
            Upgrade to Bond Media Studio Pro
          </h2>
          <p className="text-neutral-500 text-base mt-2 max-w-sm">
            Unlock unlimited website creation with Bond Media Studio Pro.
          </p>
          <hr className="bg-neutral-200 w-full max-w-[150px] my-6" />
          <p className="text-lg mt-3 text-neutral-900 font-semibold">
            Upgrade to <ProTag className="mx-1" /> and unlock unlimited
            website creation with Bond Media Studio ⚡
          </p>
          <ul className="mt-3 space-y-1 text-neutral-500">
            <li className="text-sm text-neutral-500 space-x-2 flex items-center justify-start gap-2 mb-3">
              You&apos;ll unlock amazing Bond Media Studio Pro features:
            </li>
            <li className="text-sm space-x-2 flex items-center justify-start gap-2">
              <CheckCheck className="text-emerald-500 size-4" />
              Create unlimited websites with premium templates
            </li>
            <li className="text-sm space-x-2 flex items-center justify-start gap-2">
              <CheckCheck className="text-emerald-500 size-4" />
              Access to premium website templates and themes
            </li>
            <li className="text-sm space-x-2 flex items-center justify-start gap-2">
              <CheckCheck className="text-emerald-500 size-4" />
              Priority support and advanced customization options
            </li>
            <li className="text-sm text-neutral-500 space-x-2 flex items-center justify-start gap-2 mt-3">
              ... and lots more!
            </li>
          </ul>
          <Button
            variant="black"
            size="lg"
            className="w-full !text-base !h-11 mt-8"
            onClick={handleProClick}
          >
            Upgrade to Pro (Coming Soon)
          </Button>
        </main>
      </DialogContent>
    </Dialog>
  );
};

const ProTag = ({ className }: { className?: string }) => (
  <span
    className={`${className} bg-linear-to-br shadow-green-500/10 dark:shadow-green-500/20 inline-block -skew-x-12 border border-gray-200 from-pink-300 via-green-200 to-yellow-200 text-xs font-bold text-black shadow-lg rounded-md px-2.5 py-0.5`}
  >
    PRO
  </span>
);
export default ProModal;
