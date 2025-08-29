import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="relative bg-gradient-to-br from-vintage-cream to-vintage-paper dark:from-dark-card dark:to-dark-bg border border-vintage-gold/20 dark:border-dark-border rounded-2xl p-6 shadow-vault overflow-hidden">
      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-vintage-gold/20 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-vintage-gold/20 rounded-br-2xl" />
      
      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-vintage-gold/10 to-transparent"></div>
      
      <div className="relative z-10 animate-pulse">
        {/* Title Section */}
        <div className="mb-4">
          <div className="h-6 bg-vintage-gold/20 dark:bg-dark-accent/20 rounded-lg w-3/4 mb-3"></div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-vintage-gold/30 rounded-full"></div>
            <div className="h-3 bg-vintage-brown/20 dark:bg-dark-muted/20 rounded w-16"></div>
          </div>
        </div>

        {/* Interactive Features */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between p-2 bg-vintage-gold/5 dark:bg-dark-accent/5 rounded-lg border border-vintage-gold/10 dark:border-dark-accent/10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-vintage-gold/30"></div>
              <div className="h-3 bg-vintage-brown/20 dark:bg-dark-muted/20 rounded w-16"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-vintage-brown/20 dark:bg-dark-muted/20 rounded"></div>
              <div className="h-3 bg-vintage-brown/20 dark:bg-dark-muted/20 rounded w-12"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-vintage-brown/20 dark:bg-dark-muted/20 rounded"></div>
              <div className="h-2 bg-vintage-brown/20 dark:bg-dark-muted/20 rounded w-20"></div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-vintage-gold/30 rounded-full"></div>
              <div className="w-1 h-1 bg-vintage-gold/30 rounded-full"></div>
              <div className="w-1 h-1 bg-vintage-gold/20 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-vintage-gold/10 dark:bg-dark-accent/10 rounded-full w-16"></div>
          <div className="h-6 bg-vintage-gold/10 dark:bg-dark-accent/10 rounded-full w-20"></div>
          <div className="h-6 bg-vintage-gold/10 dark:bg-dark-accent/10 rounded-full w-14"></div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-vintage-gold/10 dark:border-dark-border">
          <div className="h-5 bg-vintage-gold/10 dark:bg-dark-accent/10 rounded w-20"></div>
          <div className="flex items-center space-x-2">
            <div className="h-7 bg-vintage-gold/20 dark:bg-dark-accent/20 rounded-lg w-14"></div>
            <div className="h-7 bg-vintage-gold/10 dark:bg-dark-accent/10 rounded-lg w-14"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;