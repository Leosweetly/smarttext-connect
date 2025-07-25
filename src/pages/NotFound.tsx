import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl">Page not found</p>
        <Button asChild className="mt-4">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}