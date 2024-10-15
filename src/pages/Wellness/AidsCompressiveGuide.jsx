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
function AidsCompressiveGuide() {
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
            "linear-gradient(90deg, rgba(0, 0, 0, 0.53) 0%, rgba(0, 0, 0, 0) 99.88%), url('/img/aids-banner.jpg')",
          backgroundPosition: "right",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="text-center text-slider text-para">
                <h1>
                  Comprehensive Overview of AIDS: Causes, Effects, and
                  Prevention
                </h1>
                <p>
                  Acquired Immunodeficiency Syndrome (AIDS) is a chronic,
                  potentially life-threatening condition caused by the Human
                  Immunodeficiency Virus (HIV).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="bainary-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="binary-details">
                <h2>Understanding AIDS: A Comprehensive Guide</h2>
                <div className="disc-bainary">
                  <div className="group-para">
                    <h3>Introduction</h3>
                    <p>
                      In recent years, society has made significant strides
                      towards recognizing and understanding gender diversity.
                      However, there's still much to learn and explore when it
                      comes to transgender experiences. In this blog, we aim to
                      delve deeper into the lives of transgender individuals,
                      shining a light on their stories, challenges, and
                      victories.
                    </p>

                    <p>
                      Transgender people often find themselves navigating a
                      world that is rigidly defined by binary gender norms.
                      However, their experiences transcend these narrow
                      categories, encompassing a rich tapestry of identities and
                      expressions. Through our blog, we seek to amplify these
                      voices and provide a platform for transgender individuals
                      to share their journeys authentically.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <h3>Origins of AIDS</h3>
                    <p>
                      The origins of AIDS trace back to the early 20th century
                      when the Human Immunodeficiency Virus (HIV) first crossed
                      from non-human primates to humans in Central Africa. The
                      most widely accepted theory suggests that HIV-1, the virus
                      responsible for the global AIDS pandemic, originated from
                      a type of chimpanzee in southeastern Cameroon.This
                      transmission likely occurred when humans hunted these
                      chimpanzees for bushmeat, coming into contact with their
                      blood. The virus then mutated and adapted within humans,
                      eventually spreading through various modes of
                      transmission, including sexual contact, contaminated
                      needles, and from mother to child during childbirth or
                      breastfeeding. The first recognized cases of AIDS emerged
                      in the late 1970s and early 1980s in the United States,
                      but retrospective studies have identified earlier cases in
                      Africa and among specific populations,
                    </p>
                  </div>

                  <div className="full-lenth mt-3">
                    <img src="/img/aidshand.png" className="img-fluid" />
                  </div>

                  <div className="group-para mt-3">
                    <h3>Transmission</h3>
                    <p>
                      The transmission of AIDS occurs through the spread of the
                      Human Immunodeficiency Virus (HIV), which attacks the
                      immune system and can lead to AIDS if untreated. HIV is
                      primarily transmitted through the exchange of certain
                      bodily fluids from an infected person. These fluids
                      include blood, semen, vaginal fluids, rectal fluids, and
                      breast milk. The most common routes of transmission
                      include unprotected sexual contact (vaginal, anal, or
                      oral) with someone who has HIV, sharing needles or other
                      injection drug equipment, and from mother to child during
                      pregnancy, childbirth, or breastfeeding.
                    </p>
                  </div>
                  <div className="group-para mt-3">
                    <h3>Prevention</h3>
                    <p>
                      Preventing AIDS primarily involves taking measures to
                      prevent the transmission of HIV, the virus that causes
                      AIDS. Key strategies for HIV prevention include.
                    </p>
                    <p>
                      Safe Sexual Practices: Using condoms consistently and
                      correctly during sexual activity significantly reduces the
                      risk of HIV transmission. Limiting the number of sexual
                      partners and engaging in mutually monogamous relationships
                      where both partners are HIV-negative can also lower risk.
                    </p>
                    <p>
                      Post-Exposure Prophylaxis (PEP): PEP involves taking
                      antiretroviral medications within 72 hours after potential
                      exposure to HIV to prevent the virus from establishing an
                      infection. PEP is an emergency intervention and is only
                      effective if started promptly.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <h3>Treatment</h3>
                    <p>
                      In recent years, society has made significant strides
                      towards recognizing and understanding gender diversity.
                      However, there's still much to learn and explore when it
                      comes to transgender experiences. In this blog, we aim to
                      delve deeper into the lives of transgender individuals,
                      shining a light on their stories, challenges, and
                      victories.
                    </p>
                    <p>
                      Transgender people often find themselves navigating a
                      world that is rigidly defined by binary gender norms.
                      However, their experiences transcend these narrow
                      categories, encompassing a rich tapestry of identities and
                      expressions. Through our blog, we seek to amplify these
                      voices and provide a platform for transgender individuals
                      to share their journeys authentically.
                    </p>
                  </div>
                  <div className="group-para mt-3">
                    <h3>Conclusion</h3>
                    <p>
                      The conclusion of AIDS involves understanding that while
                      significant progress has been made in managing HIV, the
                      virus that leads to AIDS, the global fight against the
                      epidemic is ongoing. Advances in antiretroviral therapy
                      (ART) have transformed HIV from a fatal condition into a
                      manageable chronic illness, allowing those with HIV to
                      live long, healthy lives. However, there is still no cure
                      for AIDS, and the virus continues to affect millions of
                      people worldwide, particularly in regions with limited
                      access to healthcare. Efforts to end the AIDS epidemic
                      require a multifaceted approach, including widespread
                      access to prevention methods, testing, and treatment, as
                      well as education to reduce stigma and discrimination.
                    </p>
                  </div>
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
          {/* <div className="row">
            <div className="col-lg-12 text-center">
              <a className="btn-more btn-load-more" href="#">
                Load More
              </a>
            </div>
          </div> */}
        </div>
      </section>
    </Layout>
  );
}

export default AidsCompressiveGuide;
