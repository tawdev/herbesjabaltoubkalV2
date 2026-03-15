"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PriceFilter({ maxPossiblePrice = 200 }: { maxPossiblePrice?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentMaxUrl = searchParams.get('maxPrice');
  const initialValue = currentMaxUrl ? Number(currentMaxUrl) : maxPossiblePrice;
  
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    if (currentMaxUrl) {
      setValue(Number(currentMaxUrl));
    } else {
      setValue(maxPossiblePrice);
    }
  }, [currentMaxUrl, maxPossiblePrice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  };

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('maxPrice', value.toString());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <input 
        type="range" 
        className="accent-primary" 
        min="0" 
        max={maxPossiblePrice}
        value={value}
        onChange={handleChange}
        onMouseUp={applyFilter}
        onTouchEnd={applyFilter}
      />
      <div className="flex justify-between text-xs font-black text-foreground/40 uppercase">
        <span>0 MAD</span>
        <span>{value} MAD</span>
      </div>
    </div>
  );
}
