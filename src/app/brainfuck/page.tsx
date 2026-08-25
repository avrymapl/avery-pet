import { BrainfuckIde } from "@/components/BrainfuckIde";

export const metadata = {
  title: "brainfuck — avery.pet",
  description: "a time-travelling brainfuck ide – step forwards and backwards through a full execution trace",
};

export default function BrainfuckPage() {
  return <BrainfuckIde />;
}
