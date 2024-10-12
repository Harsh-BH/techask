// src/pages/index.js
import React, { useState } from "react"; // Import useState
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { getTestData } from "../api"; // Import the new API function
import Sidebar from "@/components/Sidebar/Sidebar"; // Import the Sidebar component
import { Link } from "react-router-dom";
import { Navbar } from "@/components/navbar";

export default function IndexPage() {
  const [testData, setTestData] = useState(null); // State to hold test data
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleTestDatabase = async () => {
    setLoading(true);
    try {
      const data = await getTestData(); // Call the API function
      setTestData(data); // Set the response data
    } catch (error) {
      console.error("Error testing database:", error);
      setTestData(null); // Reset test data on error
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
<>
   <Navbar />
          
   <Sidebar />

      <div className="flex">

        
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 flex-1">
          <div className="inline-block max-w-lg text-center justify-center">
            <span className={title()}>Make&nbsp;</span>
            <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
            <br />
            <span className={title()}>
              websites regardless of your design experience.
            </span>
            <div className={subtitle({ class: "mt-4" })}>
              Beautiful, fast and modern React UI library.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              isExternal
              className={buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
              })}
              href={siteConfig.links.docs}
            >
              Documentation
            </Link>
            <Link
              isExternal
              className={buttonStyles({ variant: "bordered", radius: "full" })}
              href={siteConfig.links.github}
            >
              <GithubIcon size={20} />
              GitHub
            </Link>
          </div>

          {/* Test Database Button */}
          <div className="mt-8">
            <button
              onClick={handleTestDatabase}
              className={buttonStyles({
                color: "secondary",
                radius: "full",
                variant: "shadow",
              })}
            >
              Test Database Connection
            </button>
          </div>

          {/* Display Test Data */}
          {loading && <p>Loading...</p>}
          {testData && <p>{testData.message}</p>}
          {testData === null && !loading && <p>Failed to fetch test data.</p>}

          <div className="mt-8">
            <Snippet hideCopyButton hideSymbol variant="bordered">
              <span>
                Get started by editing{" "}
                <Code color="primary">pages/index.tsx</Code>
              </span>
            </Snippet>
          </div>
          
        </section>
    
      </div>
      </>
  );
}
