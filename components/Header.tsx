"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import react from "react"

const Header = () => {
    const pathName = usePathname();
    return (
        <header>
            <div className="main-container inner">
                <Link href="/">
                    <Image src="/logo.png" alt="RupeePulse Logo" width={100} height={50} />
                    <span className="ml-2 text-xl font-bold text-gray-800 dark:text-gray-200">RupeePulse</span>
                </Link>

                <nav className="">
                        <Link href="/" className={cn('nav-link',{
                            'is-active': pathName === '/',
                            'is-home':true
                            })}>
                                Home
                        </Link>
                        <p>All Models</p>
                        <Link href="/coins" className={cn('nav-link',{
                                'is-active': pathName === '/coins'
                            })}>
                                All Coins
                        </Link> 
                </nav>

            </div>
        </header>
    )
}

export default Header;
