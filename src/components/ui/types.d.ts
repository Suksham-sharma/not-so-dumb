declare module "@/components/ui/input" {
  import { InputHTMLAttributes } from "react";
  interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
  }
  export function Input(props: InputProps): JSX.Element;
}

declare module "@/components/ui/scroll-area" {
  interface ScrollAreaProps {
    children: React.ReactNode;
    className?: string;
  }
  export function ScrollArea(props: ScrollAreaProps): JSX.Element;
}
