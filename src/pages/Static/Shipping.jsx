import React from 'react';
import Layout from '../../components/Layout';

function Shipping() {
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
                <h1>Shipping Policy</h1>
                <p>Your convenience is our priority.</p>
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
                <h2>Shipping Policy Overview</h2>
                <div className="disc-bainary mt-3">
                  <div className="group-para">
                    <h3>Shipping Methods:</h3>
                    <p>
                      At H27 Healthcare Technologies and Services Private Limited, we offer several shipping methods to ensure you receive your order in a way that's convenient for you. The available shipping methods may vary depending on your location and the products you purchase. During the checkout process, you will be provided with a list of available shipping options for your order.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <h3>Processing Time:</h3>
                    <p>
                      Orders are typically processed within [number of business days] business days after payment is received. Please note that processing times may vary during peak seasons and promotional periods. We strive to process orders as quickly as possible while maintaining high-quality standards.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <h3>Shipping Time:</h3>
                    <p>
                      Shipping times vary depending on the shipping method you select during checkout and your location. Estimated delivery times will be provided to you during the checkout process. Please keep in mind that these are estimates, and actual delivery times may vary due to factors beyond our control, such as customs delays or weather conditions.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <h3>Shipping Fees:</h3>
                    <p>
                      Shipping fees are calculated based on the shipping method chosen, the destination, and the weight and dimensions of the items in your order. The shipping cost will be displayed to you during the checkout process before you complete your purchase.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <h3>Shipping Restrictions:</h3>
                    <p>
                      Please be aware that some products may have shipping restrictions due to their nature or regulatory requirements. We comply with all applicable shipping regulations and will not ship products where it is prohibited by law.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <h3>International Shipping:</h3>
                    <p>
                      We offer international shipping to select countries. Please note that international orders may be subject to customs duties, taxes, and fees imposed by the destination country. These charges are the responsibility of the recipient and are not included in the order total or shipping fees.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <h3>Order Tracking:</h3>
                    <p>
                      Once your order has shipped, you will receive a shipping confirmation email with a tracking number. You can use this tracking number to monitor the progress of your shipment and estimate the expected delivery date.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <h3>Lost or Delayed Shipments:</h3>
                    <p>
                      In the rare event that your shipment is lost or significantly delayed, please contact our customer support team at <a href="mailto:hello@niramayasoul.com">hello@niramayasoul.com</a>. We will work with the shipping carrier to resolve the issue and ensure that you receive your order.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <h3>Contact Information:</h3>
                    <p>
                      If you have any questions or concerns regarding our shipping policy, please contact us at <a href="mailto:hello@niramayasoul.com">hello@niramayasoul.com</a>, and our customer support team will be happy to assist you.
                    </p>
                  </div>

                  <div className="group-para mt-3">
                    <p>
                      Thank you for choosing H27 Healthcare Technologies and Services Private Limited for your healthcare needs. We appreciate your business and aim to provide you with a seamless shopping experience. We ship within 2 days and delivery within 7-8 days.
                    </p>
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

export default Shipping;
