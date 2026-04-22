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
    <div className="flex flex-col gap-6">
      <input 
        type="range" 
        className="accent-[#C5A059] h-1 bg-[#C5A059]/10 rounded-lg appearance-none cursor-pointer" 
        min="0" 
        max={maxPossiblePrice}
        value={value}
        onChange={handleChange}
        onMouseUp={applyFilter}
        onTouchEnd={applyFilter}
      />
      <div className="flex justify-between text-[9px] font-bold text-foreground/40 uppercase tracking-[0.2em]">
        <span>0 MAD</span>
        <span className="text-[#C5A059]">{value} MAD</span>
      </div>
    </div>
  );
}
