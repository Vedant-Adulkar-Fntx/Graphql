import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SearchHome } from './pages/SearchHome';
import { AboutCompany } from './pages/AboutCompany';
import { CompanyStructure } from './pages/CompanyStructure';
import { Financials } from './pages/Financials';
import { PeerComparison } from './pages/PeerComparison';
import { Directors } from './pages/Directors';
import { OpenCharges } from './pages/OpenCharges';
import { Compliance } from './pages/Compliance';
import { GST } from './pages/GST';
import { CreditRatings } from './pages/CreditRatings';
import { LegalHistory } from './pages/LegalHistory';
import { EPFO } from './pages/EPFO';

import { useScreenInit } from './useScreenInit';
export function App() {
  useScreenInit();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SearchHome />} />
          <Route path="company/:id/about" element={<AboutCompany />} />
          <Route path="company/:id/structure" element={<CompanyStructure />} />
          <Route path="company/:id/financials" element={<Financials />} />
          <Route path="company/:id/peers" element={<PeerComparison />} />
          <Route path="company/:id/directors" element={<Directors />} />
          <Route path="company/:id/charges" element={<OpenCharges />} />
          <Route path="company/:id/compliance" element={<Compliance />} />
          <Route path="company/:id/gst" element={<GST />} />
          <Route
            path="company/:id/credit-ratings"
            element={<CreditRatings />} />
          
          <Route path="company/:id/legal-history" element={<LegalHistory />} />
          <Route path="company/:id/epfo" element={<EPFO />} />

        </Route>
      </Routes>
    </BrowserRouter>);

}