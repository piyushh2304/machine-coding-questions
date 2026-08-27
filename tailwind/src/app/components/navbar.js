import Link from "next/link";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-xl bg-[#1337ec] flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 transition-all"
                        >
                            S
                        </motion.div>
                        <span className="font-black text-xl tracking-tighter text-white uppercase group-hover:tracking-normal transition-all">Vault</span>
                    </Link>
                </motion.div>

                <div className="hidden md:flex items-center gap-8 ml-8">
                    <Link href="/explore">
                        <span className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Explore</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
