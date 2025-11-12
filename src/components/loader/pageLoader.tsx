"use client";

import { AnimatePresence, motion } from "framer-motion";
import Loader from "./loader";
import { usePageLoader } from "@/context/PageLoaderContext/PageLoaderContext";

export default function PageLoader() {
  const { isLoading } = usePageLoader();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 2 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950"
        >
          <Loader />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
