import { motion } from 'framer-motion'

function Footer() {
    return (
        <>
            {/* footer */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className='fixed bottom-0 left-0 w-full p-4 text-center text-gray-500 transition-transform duration-300 cursor-pointer '
            >
                made by
                <motion.span
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                    className='text-lg font-bold hover:text-2xl transition-all duration-300'>
                    Swapnil Ingle
                </motion.span>
                <a
                    href="http://github.com/codershubinc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className='text-blue-800 text-lg font-bold hover:text-blue-600 transition-transform duration-300'
                >@codershubinc</a>
            </motion.div></>
    )
}

export default Footer