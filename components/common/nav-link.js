import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children }) {
  const path = usePathname();
  //   console.log("path: ", path);
  //   console.log("href: ", href);
  return (
    <Link href={href} className={path === href ? "text-green-800" : undefined}>
      {children}
    </Link>
  );
}
