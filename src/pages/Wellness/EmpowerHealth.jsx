import React from "react";
import Layout from "../../components/Layout";
import FaqsEmpower from "../../components/FaqsEmpower";

function EmpowerHealth() {
  return (
    <Layout>
      <div
        className="wellness-banner d-flex align-items-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.53) 0%, rgba(0, 0, 0, 0) 99.88%), url('/img/empowerBanner.png')",
          backgroundPosition: "right",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="text-center text-slider text-para">
                <h1>Empower Health: Join Our Medical Awareness Program</h1>
                <p>
                  Empower your health journey with our program, offering vital
                  insights for informed decisions on well-being..
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
                <h2>Empower Health: Join Our Medical Awareness Program</h2>
                <div className="disc-bainary">
                  <div className="group-para">
                    <h3>Introduction</h3>
                    <p>
                      In today's fast-paced world, prioritizing our health is
                      more important than ever. However, navigating the complex
                      landscape of healthcare can be daunting. That's why we're
                      excited to introduce our medical awareness program - an
                      initiative designed to empower individuals with the
                      knowledge and resources they need to take control of their
                      health and well-being.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <h3>Why Medical Awareness Matters</h3>
                    <p>
                      Medical awareness goes beyond simply knowing about common
                      illnesses and treatments. It's about understanding the
                      factors that influence our health, from genetics and
                      lifestyle choices to social determinants and access to
                      care. By raising awareness about health issues and
                      promoting preventive measures, we can reduce the burden of
                      disease and improve overall quality of life.
                    </p>
                  </div>

                  <div className="full-lenth mt-3">
                    <img src="/img/empowerHearth.png" className="img-fluid" />
                  </div>

                  <div className="group-para mt-3">
                    <h3>What Our Program Offers</h3>
                    <p>
                      Our medical awareness program is designed to provide
                      comprehensive education and support across a wide range of
                      health topics. From chronic conditions like diabetes and
                      heart disease to mental health and preventive care, our
                      program covers it all. Through a combination of
                      informative workshops, online resources, and community
                      outreach initiatives, we aim to empower individuals to
                      make informed decisions about their health.
                    </p>
                  </div>
                  <div className="group-para mt-3">
                    <h3>Joining Our Program</h3>
                    <p>
                      Joining our medical awareness program is easy! Simply sign
                      up online or reach out to our team for more information.
                      Once you're part of the program, you'll gain access to a
                      wealth of resources, including educational materials,
                      interactive workshops, and opportunities to connect with
                      healthcare professionals and fellow participants. Whether
                      you're looking to learn more about a specific health
                      condition or simply want to take proactive steps towards a
                      healthier lifestyle, our program has something for
                      everyone.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <h3>Benefits of Participation</h3>
                    <p>
                      By participating in our medical awareness program, you'll
                      not only gain valuable knowledge about health and wellness
                      but also become part of a supportive community dedicated
                      to empowering individuals to live their healthiest lives.
                      Whether you're attending a workshop, joining a support
                      group, or accessing resources online, you'll find the
                      guidance and encouragement you need to take charge of your
                      health journey.
                    </p>
                  </div>
                  <div className="group-para mt-5">
                    <h3>FAQ’s</h3>
                    <FaqsEmpower />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default EmpowerHealth;
