import React from 'react'
import { motion } from 'framer-motion'

export const Skeleton = ({ className = '', width, height }) => (
  <motion.div
    className={`bg-slate-700 rounded-lg animate-pulse ${className}`}
    style={{ width, height }}
    initial={{ opacity: 0.5 }}
    animate={{ opacity: [0.5, 0.8, 0.5] }}
    transition={{ duration: 1.5, repeat: Infinity }}
  />
)

export const SkeletonCard = () => (
  <div className="bg-slate-900/50 rounded-2xl p-6 space-y-4">
    <div className="flex items-center gap-4">
      <Skeleton width={48} height={48} className="rounded-full" />
      <div className="space-y-2">
        <Skeleton width={120} height={16} />
        <Skeleton width={80} height={12} />
      </div>
    </div>
    <Skeleton width="100%" height={20} />
    <Skeleton width="80%" height={20} />
    <Skeleton width="60%" height={20} />
  </div>
)

export const SkeletonArticle = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <Skeleton width="60%" height={40} className="rounded-xl" />
    <Skeleton width="100%" height={200} className="rounded-2xl" />
    <div className="space-y-4">
      <Skeleton width="100%" height={16} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="90%" height={16} />
      <Skeleton width="95%" height={16} />
      <Skeleton width="85%" height={16} />
    </div>
  </div>
)

export default Skeleton
