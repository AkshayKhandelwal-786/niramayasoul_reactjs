import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Assuming you're using React Router for navigation

const useConditionalCSS = () => {
  const location = useLocation(); // Get the current URL location

  useEffect(() => {
    // Get links to the specific CSS files
    const mdbLink = document.querySelector("link[href*='mdb.min.css']");
    //const bootstrapLink = document.querySelector("link[href*='/css/wo_bootstrap.css']");
    const customLink = document.querySelector("link[href*='/css/wo_custom.css']");

    // Check if we are on the specific page
    const isOrderPage = location.pathname === '/order-by-whatsapp'; 

    // Function to add a CSS link
    const addCSSLink = (href, id) => {
      let linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = href;
      linkElement.id = id;
      document.head.appendChild(linkElement);
    };

    // Handle CSS loading for the '/order-by-whatsapp' page
    if (isOrderPage) {
      // Remove MDB CSS if it exists
      if (mdbLink) {
        //mdbLink.parentNode.removeChild(mdbLink);
      }
      // Add 'wo_bootstrap.css' and 'wo_custom.css' if they don't already exist
      // if (!bootstrapLink) {
      //   addCSSLink('/css/wo_bootstrap.css', 'bootstrap-css');
      // }
      if (!customLink) {
        addCSSLink('/css/wo_custom.css', 'custom-css');
      }
    } else {
      // For all other pages, add MDB CSS if it's missing
      if (!mdbLink) {
        addCSSLink('/css/mdb.min.css', 'mdb-css');
      }
      // Remove 'wo_bootstrap.css' and 'wo_custom.css' from other pages if they exist
      // if (bootstrapLink) {
      //   bootstrapLink.parentNode.removeChild(bootstrapLink);
      // }
      if (customLink) {
        customLink.parentNode.removeChild(customLink);
      }
    }

    // Cleanup function to handle removal of CSS on component unmount
    return () => {
      const existingMDB = document.querySelector("#mdb-css");
      // const existingBootstrap = document.querySelector("#bootstrap-css");
      const existingCustom = document.querySelector("#custom-css");

      // Ensure CSS is cleaned up if not needed
      if (existingMDB && isOrderPage) existingMDB.parentNode.removeChild(existingMDB);
      // if (existingBootstrap && !isOrderPage) existingBootstrap.parentNode.removeChild(existingBootstrap);
      if (existingCustom && !isOrderPage) existingCustom.parentNode.removeChild(existingCustom);
    };
  }, [location]);
};

export default useConditionalCSS;
