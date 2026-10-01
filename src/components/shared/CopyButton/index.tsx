import Button from "@/components/ui/Button";
import { useAlert } from "@/context/AlertContext";
import CopyIcon from "@/assets/icons/copy.inline.svg?react";

interface CopyButtonProps {
  text: string;
  label: string;
}

const CopyButton = ({ text, label }: CopyButtonProps) => {
  const { showAlert } = useAlert();

  const handleCopy = () => {
    navigator.clipboard.writeText(text); // 將文字寫入剪貼簿
    showAlert({
      variant: "success",
      message: `已複製${label}！`,
      dismissTimeout: 1500,
    });
  };

  return (
    <Button
      variant="icon"
      icon={CopyIcon}
      onClick={handleCopy}
      aria-label={`複製${label}`}
    />
  );
};

export default CopyButton;
