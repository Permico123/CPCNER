/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Professions from "./components/Professions";
import Fees from "./components/Fees";
import Authorities from "./components/Authorities";
import Resources from "./components/Resources";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <About />
        <Professions />
        <Fees />
        <Authorities />
        <Resources />
      </main>
      <Footer />
    </div>
  );
}
