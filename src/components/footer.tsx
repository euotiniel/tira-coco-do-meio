"use client";
import Link from "next/link";

export default function Footer() {

  return (
    <footer className="w-full flex flex-col md:flex-row items-center justify-center text-neutral-600 dark:text-neutral-400">
      <div>
        <p className="text-[13.5px] font-normal leading-none">
          2024 &copy;{" "}
          <Link
            href="https://twitter.com/euotiniel"
            className="font-medium underline underline-offset-4"
          >
            euotiniel
          </Link>{" "}
          . The source code is available on{" "}
          <Link
            href={"https://github.com/euotiniel/tira-coco-do-meio"}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </Link>
        </p>
      </div>
    </footer>
  );
}