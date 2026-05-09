import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/70 py-10">
      <div className="container-tight flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md accent-bg flex items-center justify-center font-extrabold text-primary-foreground text-sm">S</div>
          <span className="font-bold text-primary-foreground">SmartOps</span>
        </div>
        <div>© {new Date().getFullYear()} SmartOps. GoHighLevel agency for home-service pros.</div>
      </div>
    </footer>
  );
}
