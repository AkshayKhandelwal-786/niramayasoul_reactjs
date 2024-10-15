import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axiosConfig from "../../services/axiosConfig";
import { Link, useParams, useLocation } from "react-router-dom";
const toSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric and non-space characters
    .replace(/[\(\)]/g, "") // Remove parentheses explicitly
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Ensure no multiple hyphens
};
function Transgender() {
  const [loading, setLoading] = useState(true); // For loading state
  const [recommed, setRecommed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recommendedMedicinesResponse = await axiosConfig.get(
          "/medicines/recommended_medicines",
          {
            params: {
              page: 1,
              query: "",
            },
          }
        );
        const limitedData = recommendedMedicinesResponse.data.data;

        setRecommed(limitedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchData();
  }, []); // Dependency array to run effect only once

  return (
    <Layout>
      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <div
        className="wellness-banner d-flex align-items-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.53) 0%, rgba(0, 0, 0, 0) 99.88%), url('/img/wellness-details.jpg')",
          backgroundPosition: "right",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-7 mx-auto">
              <div className="text-center text-slider text-para">
                <h1>Navigating the Complexities of Transgender Experiences</h1>
                <p>
                  Transgender experiences encompass a diverse range of
                  identities, challenges, and journeys as individuals navigate
                  their gender identity in a society that often adheres to
                  binary norms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bainary-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="binary-details">
                <h2>Beyond the Binary: Exploring Transgender Experiences</h2>
                <div className="disc-bainary">
                  <p>
                    In recent years, society has made significant strides
                    towards recognizing and understanding gender diversity.
                    However, there's still much to learn and explore when it
                    comes to transgender experiences. In this blog, we aim to
                    delve deeper into the lives of transgender individuals,
                    shining a light on their stories, challenges, and victories.
                  </p>
                  <p>
                    Transgender people often find themselves navigating a world
                    that is rigidly defined by binary gender norms. However,
                    their experiences transcend these narrow categories,
                    encompassing a rich tapestry of identities and expressions.
                    Through our blog, we seek to amplify these voices and
                    provide a platform for transgender individuals to share
                    their journeys authentically.
                  </p>
                  <p>
                    One of the key aspects of understanding transgender
                    experiences is recognizing the complexity of gender
                    identity. While society often insists on viewing gender as a
                    simple binary - male or female - the reality is far more
                    nuanced. Transgender individuals may identify as male,
                    female, both, neither, or something else entirely. By
                    exploring these diverse identities, we hope to challenge
                    preconceived notions and foster greater acceptance and
                    empathy.{" "}
                  </p>
                </div>

                <div className="d-xl-flex gap-3">
                  <a
                    className="cart-btn fixwidth mb-xl-0 mb-2 bainary"
                    href="#"
                  >
                    Book Digital Consult
                  </a>
                  <a
                    className="cart-btn btn-clinic fixwidth mb-0 bookclinic bainary"
                    href="#"
                  >
                    Book Clinic Visit
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-5 pe-lg-0">
              <div className="binary-img">
                <img className="img-fluid" src="/img/binary.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-0 py-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 mx-auto">
              <div className="heading text-left mb-4 position-relative headingcart">
                <h2 className="pb-0">Recommended Medicines</h2>
              </div>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4 mb-1">
            {recommed.map((medicine) => (
              <div className="col" key={medicine.id}>
                <div className="h-100 d-flex flex-column">
                  <Link
                    to={`/pharmacy/product/${toSlug(medicine.name)}`}
                    state={{ piD: medicine.id }}
                    className=""
                  >
                    <div className="prduct-card pharmacy-image">
                      <img
                        className="img-fluid w-100"
                        src={medicine.images[0] || "/img/default.png"}
                        alt={medicine.name || "Product Image"}
                      />
                    </div>
                  </Link>
                  <div className="product-dis flex-grow-1 d-flex flex-column">
                    <span>{medicine.medicine_category?.name || "N/A"}</span>
                    <p>{medicine.name || "N/A"}</p>
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
        </div>
      </section>
    </Layout>
  );
}

export default Transgender;
