import React from "react";
import Layout from "../../components/Layout";

function Refund() {
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
                <h1>Refund and Cancellation Policy</h1>
                <p>Your privacy is important to us.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="bainary-top">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2>Refund Policy:</h2>
              <div className="disc-bainary mt-3">
                <div className="group-para">
                  <p>
                    We value your satisfaction with our products and services at
                    H27 Healthcare Technologies and Services Private Limited. If
                    you encounter any issues with your purchase, please contact
                    our customer support team within [number of days] days of
                    receiving your order at{" "}
                    <a href="mailto:hello@niramayasoul.com">
                      hello@niramayasoul.com
                    </a>
                    . We are committed to resolving any concerns you might have.
                  </p>
                  <p>
                    Refunds will be processed under the following circumstances:
                  </p>
                  <ul>
                    <li>
                      <strong>Damaged or Defective Products:</strong> If you
                      receive a damaged or defective product, please notify us
                      immediately. We will arrange for a replacement or issue a
                      full refund.
                    </li>
                    <li>
                      <strong>Incorrect Product:</strong> If you receive an
                      incorrect product, kindly contact us within [number of
                      days] days of receiving your order. We will ship the
                      correct item to you or issue a refund, based on your
                      preference.
                    </li>
                    <li>
                      <strong>Unsatisfactory Performance:</strong> If you are
                      dissatisfied with the performance of our product or
                      service, please get in touch with us within [number of
                      days] days of purchase. We may request additional
                      information regarding the usage of the product before
                      proceeding with the refund process.
                    </li>
                  </ul>
                </div>
                <div className="group-para">
                <h2>Cancellation Policy:</h2>
                <p>
                  You have the option to cancel your order within [number of
                  hours or days] of placing it. To cancel your order, please
                  contact our customer support team at{" "}
                  <a href="mailto:hello@niramayasoul.com">
                    hello@niramayasoul.com
                  </a>{" "}
                  as soon as possible. Unfortunately, orders that have already
                  been processed or shipped cannot be canceled.
                </p>
                </div>
                <div className="group-para">

                <h2>How to Request a Refund or Cancel an Order:</h2>
                <p>
                  To request a refund or cancel an order, please reach out to
                  our customer support team via email at{" "}
                  <a href="mailto:hello@niramayasoul.com">
                    hello@niramayasoul.com
                  </a>
                  . When contacting us, include your order number and provide a
                  detailed explanation of the reason for your refund request or
                  cancellation.
                </p>
                </div>
                <div className="group-para">

                <p>
                  <strong>Please Note:</strong> Refunds will be issued using the
                  original method of payment.
                </p>

                <p>
                  Thank you for choosing H27 Healthcare Technologies and
                  Services Private Limited. We appreciate your business and are
                  here to assist you with any concerns you may have.
                </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Refund;
