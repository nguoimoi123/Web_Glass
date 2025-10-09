import React, { useEffect, useState, createContext, useContext } from 'react';

export interface Product {
  id: string;
  legacyId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  description?: string;
  images?: string[];
  newFiles?: File[];
}
export interface ApiProduct {
  _id: string;
  legacyId?: string | number;
  name: string;
  category?: string;
  categoryName?: string;
  price?: number;
  stock?: number;
  status?: 'Active' | 'Inactive' | 'Out of Stock';
  description?: string;
  images?: string[];
}