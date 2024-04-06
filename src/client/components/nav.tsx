
import Link from "next/link";
import LocalizedClientLink from "./localized-client-link"


export default async function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white dark:bg-black border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular px-20">
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">{/* <SideMenu regions={regions} /> */}</div>
          </div>

          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              Store
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-14 h-full flex-1 basis-0 justify-end">
            <Link href={"#"}><p>Languages</p></Link>
            <Link href={"/inventory"}><p>Inventory</p></Link>
          </div>
        </nav>
      </header>
    </div>
  );
}
