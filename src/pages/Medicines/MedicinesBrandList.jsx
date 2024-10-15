import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import Slider from "../../components/Slider";
import { Link, useLocation } from "react-router-dom";
import axiosConfig from "../../services/axiosConfig";

const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric and non-space characters
    .replace(/[\(\)]/g, "") // Remove parentheses explicitly
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Ensure no multiple hyphens
};

function MedicinesBrandList() {
  const [medicines, setMedicines] = useState([]);
  const [sortedAndFilteredMedicines, setSortedAndFilteredMedicines] = useState(
    []
  );
  const [categories, setCategories] = useState([]); // State for categories
  const location = useLocation();
  const { brandID } = location.state || {}; // Retrieve the state passed from navigate
  const [loading, setLoading] = useState(true); // For loading state
  const [sortOption, setSortOption] = useState("default"); // State for sorting
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [page, setPage] = useState(1); // State to manage pagination

  useEffect(() => {
    getProductsBasedOnBrand(page, true); // Fetch products on page change and append them
  }, [page]);

  const updateSortedAndFilteredMedicines = () => {
    if (medicines.length === 0) return; // Early return if no medicines

    let sortedArray = [...medicines]; // Work on a copy of the medicines array

    // Apply category filter
    if (selectedCategory) {
      sortedArray = sortedArray.filter(
        (medicine) => medicine.medicine_category.name === selectedCategory
      );
    }

    // Apply sorting based on the selected sort option
    if (sortOption === "priceAsc") {
      sortedArray.sort((a, b) => a.approx_mrp - b.approx_mrp);
    } else if (sortOption === "priceDesc") {
      sortedArray.sort((a, b) => b.approx_mrp - a.approx_mrp);
    }

    // Replace the sorted and filtered medicines
    setSortedAndFilteredMedicines(sortedArray);
  };

  useEffect(() => {
    updateSortedAndFilteredMedicines(); // Update the list when sort, filter, or medicines change
  }, [sortOption, selectedCategory, medicines]);

  useEffect(() => {
    // Extract unique categories only when medicines are fetched
    if (medicines.length > 0) {
      const uniqueCategories = [
        ...new Set(
          medicines.map((medicine) => medicine.medicine_category.name)
        ),
      ];
      setCategories(uniqueCategories);
    }
  }, [medicines]);

  const getProductsBasedOnBrand = async (page, append = true) => {
    try {
      const response = await axiosConfig.get(`/brands/${brandID}`, {
        params: {
          page: page, // Use page number for pagination
        },
      });
      const newMedicines = response.data.data.medicines;

      // Append or replace medicines based on append flag
      if (append) {
        setMedicines((prevMedicines) => {
          // Filter out duplicates based on unique medicine id
          const uniqueNewMedicines = newMedicines.filter(
            (newMedicine) =>
              !prevMedicines.some((medicine) => medicine.id === newMedicine.id)
          );
          return [...prevMedicines, ...uniqueNewMedicines];
        });
      } else {
        setMedicines(newMedicines);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryFilterChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reset to the first page when filtering
    getProductsBasedOnBrand(1, false); // Fetch the filtered medicines without appending
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPage(1); // Reset to the first page when sorting
    getProductsBasedOnBrand(1, false); // Fetch the sorted medicines without appending
  };

  const loadMoreMedicines = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page number
  };
  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader"></div>
      </div>
    ); // Show loader overlay
  }
  console.log(categories);

  return (
    <Layout>
      <Slider page="medicines" />
      <section className="py-0 py-50">
        <div className="container">
          <div className="row gy-lg-0 gy-4">
            <div className="col-lg-4 h-100">
              <div className="card-products position-relative card-products-medciane color-background">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-6">
                    <div className="product-text product-med">
                      <div className="mb-space mb-0">
                        <p className="offsell">
                          Get Up to <span>20%</span> Off
                        </p>
                        <h3 className="titlewidth">Natural Ayurvedic</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-6">
                    <div className="jarimg">
                      <img src="" />
                      <img
                        className="img-fluid"
                        src="/img/ayurveda-medi.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-products position-relative card-products-medciane color-background womenhealth">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-6">
                    <div className="product-text product-med">
                      <div className="mb-space mb-0">
                        <p className="offsell pinkcolor">
                          Get Up to <span>20%</span> Off
                        </p>
                        <h3 className="titlewidth">Women Health Products</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-6">
                    <div className="jarimg">
                      <img src="" />
                      <img
                        className="img-fluid"
                        src="/img/womenhealthpro.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card-products position-relative card-products-medciane color-background eyecare">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-6">
                    <div className="product-text product-med">
                      <div className="mb-space mb-0">
                        <p className="offsell blue">
                          Get Up to <span>20%</span> Off
                        </p>
                        <h3 className="titlewidth">Eye Care Solution</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-6">
                    <div className="jarimg">
                      <img src="" />
                      <img
                        className="img-fluid"
                        src="/img/eyecarepro.png"
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-0 pb-25">
        <div className="container">
          <div className="row gy-lg-0 gy-4">
            <div className="col-lg-6">
              <div className="d-lg-flex align-items-center position-relative">
                <span className="sortby">
                  <img src="/img/sortby.svg" alt="" />
                  Sort By
                </span>
                <div className="position-relative w-100 w-17">
                  <img
                    className="dropdown-search"
                    src="/img/arrowdown.svg"
                    alt="icon"
                  />
                  <select
                    className="form-control form-cus"
                    onChange={handleSortChange} // Call handleSortChange on sorting
                  >
                    <option value="default">Sort by</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row gy-lg-0 gy-4">
                <div className="col-lg-12">
                  <div className="d-lg-flex align-items-center position-relative justify-content-end">
                    <span className="sortby">Shop by Category</span>
                    <div className="position-relative w-100 w-17">
                      <img
                        className="dropdown-search"
                        src="/img/arrowdown.svg"
                        alt="icon"
                      />
                      <select
                        className="form-control form-cus"
                        onChange={handleCategoryFilterChange} // Call handleCategoryFilterChange on category selection
                      >
                        <option value="">Select Category</option>
                        {categories.slice(0, 25).map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-0 pb-25">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mx-auto">
              <div className="heading text-left mb-4 position-relative headingcart">
                <h2 className="pb-0">
                  Number of Products ({sortedAndFilteredMedicines.length})
                </h2>
              </div>
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4 mb-70">
            {sortedAndFilteredMedicines.map((medicine) => (
              <div className="col" key={medicine.id}>
                <div className="h-100 d-flex flex-column">
                  {" "}
                  {/* Ensure the card takes equal height */}
                  <Link
                    to={`/pharmacy/product/${toSlug(medicine.name)}`}
                    state={{ piD: medicine.id }}
                  >
                    <div className="prduct-card pharmacy-image">
                      <img
                        className="img-fluid w-100"
                        src={medicine.images[0]}
                        alt={medicine.name}
                      />
                    </div>
                  </Link>
                  <div className="product-dis flex-grow-1 d-flex flex-column">
                    <span>{medicine.brand.name}</span>
                    <p>{medicine.name}</p>
                    <div className="price mt-auto">
                    <p>
                        ₹{medicine?.new_price || medicine?.approx_mrp}
                        {medicine?.new_price && (
                          <span>
                            <del> MRP ₹{medicine?.approx_mrp}</del>
                          </span>
                        )}
                      </p>
                    </div>
                    <Link
                      className="cart-btn mt-auto"
                      to={`/pharmacy/product/${toSlug(medicine.name)}`}
                      state={{ piD: medicine.id }}
                    >
                      <img src="/img/btnc.svg" alt="Add to cart" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* {sortedAndFilteredMedicines.length > 0 && (
            <div className="row">
              <div className="col-lg-12 text-center">
                <button
                  className="btn-more btn-load-more"
                  onClick={loadMoreMedicines}
                >
                  Load More
                </button>
              </div>
            </div>
          )} */}
        </div>
      </section>
    </Layout>
  );
}

export default MedicinesBrandList;
