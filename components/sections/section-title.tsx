import { motion } from "framer-motion"

export default function SectionTitle({ title }: { title: string }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className="text-3xl font-extrabold md:text-4xl bg-gradient-to-r from-orange-500 to-gray-500 text-transparent bg-clip-text py-4"
    >
      {title}
    </motion.h1>
  )
}
