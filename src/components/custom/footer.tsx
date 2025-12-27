import { motion } from 'framer-motion'

function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className='w-full p-6 text-center text-xs font-mono text-zinc-600'
        >
            <span>crafted by </span>
            <a
                href="http://github.com/codershubinc"
                target="_blank"
                rel="noopener noreferrer"
                className='text-zinc-500 hover:text-zinc-300 transition-colors duration-300'
            >
                @codershubinc
            </a>
            <span className="mx-2 text-zinc-800">|</span>
            <span className="opacity-50">v1.5.2</span>
        </motion.footer>
    )
}

export default Footer