import { BrainfuckIde } from "@/components/brainfuck/BrainfuckIde";

export const metadata = {
  title: "brainfuck IDE — avery.pet",
  description: "a time-travelling brainfuck IDE – full execution trace with live tape preview",
};

export default function BrainfuckPage() {
  return <BrainfuckIde />;
}
